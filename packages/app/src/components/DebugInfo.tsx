import { useEffect, useState } from 'react';

/**
 * Debug log entry interface for storing console debug messages.
 */
interface DebugLogEntry {
  /** Timestamp when the log entry was created */
  timestamp: number;
  /** The debug message text */
  message: string;
  /** Optional serialized data associated with the debug message */
  data?: string;
}

/**
 * DebugInfo Component
 *
 * A debug overlay component that captures and displays console debug messages on-screen.
 * Useful for debugging on mobile devices where console access is limited.
 *
 * @remarks
 * - Intercepts `console.log` and `console.debug` calls that contain '[DEBUG]' in the message
 * - Displays captured logs in an overlay opened by tapping the red badge (bottom-right)
 * - Automatically disabled in test environments to prevent interference
 * - Handles circular reference errors when serializing objects (e.g., DOM elements)
 * - Individual log entries can be copied to clipboard by hovering and clicking the copy button
 * - All logs can be copied at once using the "Copy All" button
 *
 * @example
 * ```tsx
 * // Add to your app root
 * <DebugInfo />
 *
 * // Use in your code
 * console.log('[DEBUG] User clicked button:', { userId: 123, action: 'click' });
 * console.debug('[DEBUG] API call result:', { status: 200, data: response });
 * ```
 *
 * @returns A debug overlay component that shows when the floating badge is tapped
 */
export function DebugInfo() {
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Skip console.log interception in test environment
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'test') {
      return;
    }

    // Intercept console.log and console.debug to capture debug messages
    const originalConsoleLog = console.log;
    const originalConsoleDebug = console.debug;

    const handleDebugMessage =
      (originalMethod: typeof console.log, methodName: string) =>
      (...args: unknown[]) => {
        // Call original console method first
        originalMethod(...args);

        // Check if this is a debug message
        const firstArg = args[0];
        if (typeof firstArg === 'string' && firstArg.includes('[DEBUG]')) {
          setLogs((prev) => {
            const dataString = args[1]
              ? typeof args[1] === 'object'
                ? (() => {
                    try {
                      return JSON.stringify(args[1], null, 2);
                    } catch (error) {
                      // Handle circular references and DOM elements
                      if (
                        error instanceof Error &&
                        error.message.includes('circular')
                      ) {
                        return '[Circular reference detected]';
                      }
                      return '[Cannot serialize object]';
                    }
                  })()
                : String(args[1])
              : undefined;
            const newEntry: DebugLogEntry = {
              timestamp: Date.now(),
              message: `${methodName}: ${firstArg}`,
              data: dataString,
            };
            // Keep only last 20 entries
            const updated = [...prev, newEntry].slice(-20);
            return updated;
          });
        }
      };

    console.log = handleDebugMessage(originalConsoleLog, 'LOG');
    console.debug = handleDebugMessage(originalConsoleDebug, 'DEBUG');

    // Cleanup
    return () => {
      console.log = originalConsoleLog;
      console.debug = originalConsoleDebug;
    };
  }, []);

  // NOTE: Previous implementation used global triple-tap. Simplified to an explicit badge tap
  // for clearer discoverability and to avoid accidental toggles.

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          aria-label="Show debug logs"
          onClick={() => setIsVisible(true)}
          onTouchEnd={() => setIsVisible(true)}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-300 active:scale-[0.97] transition"
        >
          logs
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-2/3 left-0 right-0 bottom-0 z-40 bg-black/90 text-white text-xs overflow-auto sm:top-1/2">
      <div className="sticky top-0 bg-red-600 text-white p-2 flex justify-between items-center gap-2">
        <span>Debug Logs ({logs.length})</span>
        <div className="flex gap-1">
          <button
            onClick={async () => {
              const allLogs = logs
                .map(
                  (log) =>
                    `${new Date(log.timestamp).toLocaleString()}\n${log.message}${log.data ? `\n${log.data}` : ''}`,
                )
                .join('\n\n');
              try {
                await navigator.clipboard.writeText(allLogs);
                setCopiedAll(true);
                setTimeout(() => setCopiedAll(false), 2000);
              } catch {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = allLogs;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopiedAll(true);
                setTimeout(() => setCopiedAll(false), 2000);
              }
            }}
            className={`px-2 py-1 rounded text-xs transition-colors ${
              copiedAll ? 'bg-green-600' : 'bg-blue-700 hover:bg-blue-600'
            }`}
            title="Copy all logs to clipboard"
          >
            {copiedAll ? '✓ Copied' : 'Copy All'}
          </button>
          <button
            onClick={() => {
              setLogs([]);
            }}
            className="bg-red-700 px-2 py-1 rounded text-xs"
          >
            Clear
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-red-700 px-2 py-1 rounded text-xs"
          >
            Hide
          </button>
        </div>
      </div>
      <div className="p-2 space-y-1">
        {logs.map((log, index) => (
          <div
            key={`${log.timestamp}-${index}`}
            className="border-b border-gray-600 pb-1 group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="text-gray-400 text-xs">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
                <div className="text-green-400 font-mono">{log.message}</div>
                {log.data && (
                  <div className="text-blue-400 font-mono whitespace-pre-wrap ml-2">
                    {log.data}
                  </div>
                )}
              </div>
              <button
                onClick={async () => {
                  const logText = `${new Date(log.timestamp).toLocaleString()}\n${log.message}${log.data ? `\n${log.data}` : ''}`;
                  try {
                    await navigator.clipboard.writeText(logText);
                    setCopiedIndex(index);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  } catch {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = logText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    setCopiedIndex(index);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  }
                }}
                className={`px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-all ml-2 flex-shrink-0 ${
                  copiedIndex === index
                    ? 'bg-green-600 opacity-100'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Copy this log entry"
              >
                {copiedIndex === index ? '✓' : '📋'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
