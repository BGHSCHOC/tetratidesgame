import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings?.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function getCurrentUser() {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

export async function createRepository(name: string, description: string, isPrivate: boolean = false) {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.rest.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
    auto_init: true,
  });
  return data;
}

export async function pushFiles(owner: string, repo: string, files: { path: string; content: Buffer }[], commitMessage: string) {
  const octokit = await getUncachableGitHubClient();
  
  let refData;
  let isNewRepo = false;
  
  try {
    refData = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: 'heads/main',
    }).then(response => response.data);
  } catch (error: any) {
    if (error.status === 404 || error.status === 409) {
      try {
        const { data: defaultBranch } = await octokit.rest.repos.get({ owner, repo });
        refData = await octokit.rest.git.getRef({
          owner,
          repo,
          ref: `heads/${defaultBranch.default_branch}`,
        }).then(response => response.data);
      } catch (refError: any) {
        if (refError.status === 404 || refError.status === 409) {
          isNewRepo = true;
        } else {
          throw refError;
        }
      }
    } else {
      throw error;
    }
  }

  const blobs = await Promise.all(
    files.map(async (file) => {
      const { data } = await octokit.rest.git.createBlob({
        owner,
        repo,
        content: file.content.toString('base64'),
        encoding: 'base64',
      });
      return {
        path: file.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: data.sha,
      };
    })
  );

  let newTree;
  if (isNewRepo) {
    const { data } = await octokit.rest.git.createTree({
      owner,
      repo,
      tree: blobs,
    });
    newTree = data;
  } else {
    const commitSha = refData!.object.sha;
    const { data: commitData } = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: commitSha,
    });

    const { data } = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: commitData.tree.sha,
      tree: blobs,
    });
    newTree = data;
  }

  const newCommitParams: any = {
    owner,
    repo,
    message: commitMessage,
    tree: newTree.sha,
  };

  if (!isNewRepo) {
    newCommitParams.parents = [refData!.object.sha];
  }

  const { data: newCommit } = await octokit.rest.git.createCommit(newCommitParams);

  if (isNewRepo) {
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: 'refs/heads/main',
      sha: newCommit.sha,
    });
  } else {
    await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: refData!.ref.replace('refs/', ''),
      sha: newCommit.sha,
    });
  }

  return newCommit;
}

export async function listRepositories() {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
  });
  return data;
}
