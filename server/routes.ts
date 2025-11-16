import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import * as github from "./github";
import fs from "fs/promises";
import path from "path";

async function readDirectory(dirPath: string, baseDir: string, projectFiles: { path: string; content: Buffer }[]) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.name === 'node_modules' || 
        entry.name === '.git' || 
        entry.name === 'dist' ||
        entry.name === '.replit' ||
        entry.name.startsWith('.')) {
      continue;
    }
    
    if (entry.isDirectory()) {
      await readDirectory(fullPath, baseDir, projectFiles);
    } else {
      try {
        const content = await fs.readFile(fullPath);
        projectFiles.push({
          path: relativePath,
          content,
        });
      } catch (err) {
        console.error(`Error reading file ${fullPath}:`, err);
      }
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // GitHub API routes
  
  app.get("/api/github/user", async (req, res) => {
    try {
      const user = await github.getCurrentUser();
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/github/repositories", async (req, res) => {
    try {
      const repos = await github.listRepositories();
      res.json(repos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/github/create-repository", async (req, res) => {
    try {
      const { name, description, isPrivate } = req.body;
      const repo = await github.createRepository(name, description, isPrivate);
      res.json(repo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/github/push-project", async (req, res) => {
    try {
      const { owner, repo, commitMessage } = req.body;
      
      const projectFiles: { path: string; content: Buffer }[] = [];
      const projectRoot = path.resolve(process.cwd());
      await readDirectory(projectRoot, projectRoot, projectFiles);
      
      const result = await github.pushFiles(owner, repo, projectFiles, commitMessage);
      
      res.json({ 
        success: true, 
        commit: result,
        filesCount: projectFiles.length 
      });
    } catch (error: any) {
      console.error('Error pushing to GitHub:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
