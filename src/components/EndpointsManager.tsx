'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { fetchEndpoints, createEndpoint, updateEndpoint, deleteEndpoint } from '@/lib/api';
import type { WebhookEndpoint } from '@/lib/types';

export default function EndpointsManager() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEndpointName, setNewEndpointName] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});

  const loadUserEndpoints = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await fetchEndpoints();
      setEndpoints(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load webhook endpoints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserEndpoints();
  }, [isAuthenticated]);

  if (!isAuthenticated || !user) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 text-center">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Webhook Endpoints & Multi-Repository Setup
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Please log in with GitHub to create and manage custom webhook endpoints for your repositories.
        </p>
      </div>
    );
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEndpointName.trim()) return;

    try {
      setCreating(true);
      setError(null);
      await createEndpoint(newEndpointName.trim());
      setNewEndpointName('');
      await loadUserEndpoints();
    } catch (err: any) {
      setError(err.message || 'Failed to create webhook endpoint');
    } finally {
      setCreating(false);
    }
  };

  const handleToggle = async (endpoint: WebhookEndpoint) => {
    try {
      await updateEndpoint(endpoint.id, { isEnabled: !endpoint.isEnabled });
      await loadUserEndpoints();
    } catch (err: any) {
      setError(err.message || 'Failed to update endpoint status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook endpoint?')) return;
    try {
      await deleteEndpoint(id, false);
      await loadUserEndpoints();
    } catch (err: any) {
      setError(err.message || 'Failed to delete endpoint');
    }
  };

  const copyToClipboard = (text: string, id: string, isSecret = false) => {
    navigator.clipboard.writeText(text);
    if (isSecret) {
      setCopiedSecretId(id);
      setTimeout(() => setCopiedSecretId(null), 2000);
    } else {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getWebhookUrl = (id: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    // Backend API is on 3000 (or NEXT_PUBLIC_API_URL base)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `${origin}/api/v1`;
    return `${apiUrl}/webhooks/${id}`;
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            My Webhook Endpoints
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Create dedicated webhook URLs to connect your GitHub repositories securely.
          </p>
        </div>
        <form onSubmit={handleCreate} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Endpoint name (e.g. My Repo)"
            value={newEndpointName}
            onChange={(e) => setNewEndpointName(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:ring-white"
          />
          <button
            type="submit"
            disabled={creating || !newEndpointName.trim()}
            className="text-xs font-medium px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            {creating ? 'Creating...' : '+ New Endpoint'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
          {error}
        </div>
      )}

      {loading && endpoints.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">Loading endpoints...</div>
      ) : endpoints.length === 0 ? (
        <div className="py-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 text-xs">
          No webhook endpoints created yet. Create one above to get your unique GitHub webhook URL and secret.
        </div>
      ) : (
        <div className="space-y-4">
          {endpoints.map((ep) => {
            const webhookUrl = getWebhookUrl(ep.id);
            const showSecret = showSecretMap[ep.id];
            return (
              <div
                key={ep.id}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                      {ep.name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        ep.isEnabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900'
                          : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {ep.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(ep)}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      {ep.isEnabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ep.id)}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Webhook URL row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-medium text-zinc-500 whitespace-nowrap">Payload URL:</span>
                    <code className="text-zinc-800 dark:text-zinc-200 truncate select-all font-mono">
                      {webhookUrl}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(webhookUrl, ep.id, false)}
                    className="text-xs font-medium px-3 py-1 rounded bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors cursor-pointer whitespace-nowrap self-end sm:self-auto"
                  >
                    {copiedId === ep.id ? 'Copied!' : 'Copy URL'}
                  </button>
                </div>

                {/* Secret row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="font-medium text-zinc-500 whitespace-nowrap">Secret:</span>
                    <code className="text-zinc-800 dark:text-zinc-200 select-all font-mono">
                      {showSecret ? ep.secret : '••••••••••••••••••••••••'}
                    </code>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() =>
                        setShowSecretMap((prev) => ({ ...prev, [ep.id]: !prev[ep.id] }))
                      }
                      className="text-xs font-medium px-2 py-1 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      {showSecret ? 'Hide' : 'Reveal'}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ep.secret, ep.id, true)}
                      className="text-xs font-medium px-3 py-1 rounded bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                      {copiedSecretId === ep.id ? 'Copied!' : 'Copy Secret'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
