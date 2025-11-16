import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Switch } from './ui/switch';
import { Github, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
}

export function GitHubPush() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [repoName, setRepoName] = useState('tetratides-game');
  const [repoDescription, setRepoDescription] = useState('TetraTides - Ocean-themed Tetris game');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState('Initial commit from Replit');

  useEffect(() => {
    if (isOpen) {
      loadGitHubData();
    }
  }, [isOpen]);

  const loadGitHubData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userResponse = await fetch('/api/github/user');
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();
      setUser(userData);

      const reposResponse = await fetch('/api/github/repositories');
      if (!reposResponse.ok) throw new Error('Failed to fetch repositories');
      const reposData = await reposResponse.json();
      setRepositories(reposData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndPush = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const createResponse = await fetch('/api/github/create-repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repoName,
          description: repoDescription,
          isPrivate,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create repository');
      }

      const newRepo = await createResponse.json();

      const pushResponse = await fetch('/api/github/push-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: user?.login,
          repo: newRepo.name,
          commitMessage,
        }),
      });

      if (!pushResponse.ok) {
        const errorData = await pushResponse.json();
        throw new Error(errorData.error || 'Failed to push files');
      }

      const result = await pushResponse.json();
      setSuccess(`Successfully created repository and pushed ${result.filesCount} files! View it at: ${newRepo.html_url}`);
      
      await loadGitHubData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePushToExisting = async () => {
    if (!selectedRepo) {
      setError('Please select a repository');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const repo = repositories.find(r => r.full_name === selectedRepo);
      if (!repo) throw new Error('Repository not found');

      const [owner, repoName] = repo.full_name.split('/');

      const pushResponse = await fetch('/api/github/push-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner,
          repo: repoName,
          commitMessage,
        }),
      });

      if (!pushResponse.ok) {
        const errorData = await pushResponse.json();
        throw new Error(errorData.error || 'Failed to push files');
      }

      const result = await pushResponse.json();
      setSuccess(`Successfully pushed ${result.filesCount} files to ${repo.name}! View it at: ${repo.html_url}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: '#40E0D0',
            color: '#40E0D0',
          }}
        >
          <Github className="w-4 h-4" />
          Push to GitHub
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-cyan-500/50">
        <DialogHeader>
          <DialogTitle className="text-2xl text-cyan-400">Push TetraTides to GitHub</DialogTitle>
          <DialogDescription className="text-slate-300">
            Save your ocean-themed Tetris game to a GitHub repository
          </DialogDescription>
        </DialogHeader>

        {loading && !user && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          </div>
        )}

        {user && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-lg border border-cyan-500/30">
              <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-sm text-slate-400">@{user.login}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={mode === 'new' ? 'default' : 'outline'}
                onClick={() => setMode('new')}
                className={mode === 'new' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-cyan-500/50 text-cyan-400'}
              >
                Create New Repository
              </Button>
              <Button
                variant={mode === 'existing' ? 'default' : 'outline'}
                onClick={() => setMode('existing')}
                className={mode === 'existing' ? 'bg-cyan-600 hover:bg-cyan-700' : 'border-cyan-500/50 text-cyan-400'}
              >
                Push to Existing
              </Button>
            </div>

            {mode === 'new' ? (
              <Card className="bg-slate-800 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">New Repository</CardTitle>
                  <CardDescription className="text-slate-400">Create a new repository for your game</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="repo-name" className="text-white">Repository Name</Label>
                    <Input
                      id="repo-name"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="bg-slate-700 border-cyan-500/50 text-white"
                      placeholder="my-awesome-game"
                    />
                  </div>

                  <div>
                    <Label htmlFor="repo-desc" className="text-white">Description</Label>
                    <Input
                      id="repo-desc"
                      value={repoDescription}
                      onChange={(e) => setRepoDescription(e.target.value)}
                      className="bg-slate-700 border-cyan-500/50 text-white"
                      placeholder="A cool ocean-themed Tetris game"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="private-repo" className="text-white">Private Repository</Label>
                    <Switch
                      id="private-repo"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                  </div>

                  <div>
                    <Label htmlFor="commit-msg" className="text-white">Commit Message</Label>
                    <Input
                      id="commit-msg"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="bg-slate-700 border-cyan-500/50 text-white"
                      placeholder="Initial commit"
                    />
                  </div>

                  <Button
                    onClick={handleCreateAndPush}
                    disabled={loading || !repoName}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating and Pushing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Create & Push
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800 border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Existing Repository</CardTitle>
                  <CardDescription className="text-slate-400">Push to one of your repositories</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="select-repo" className="text-white">Select Repository</Label>
                    <Select value={selectedRepo} onValueChange={setSelectedRepo}>
                      <SelectTrigger className="bg-slate-700 border-cyan-500/50 text-white">
                        <SelectValue placeholder="Choose a repository" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-cyan-500/50">
                        {repositories.map((repo) => (
                          <SelectItem key={repo.id} value={repo.full_name} className="text-white">
                            {repo.name} {repo.private && '(Private)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="commit-msg-existing" className="text-white">Commit Message</Label>
                    <Input
                      id="commit-msg-existing"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="bg-slate-700 border-cyan-500/50 text-white"
                      placeholder="Update from Replit"
                    />
                  </div>

                  <Button
                    onClick={handlePushToExisting}
                    disabled={loading || !selectedRepo}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Pushing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Push to Repository
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-white">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900/50 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-100">{success}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
