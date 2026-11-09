import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Copy01Icon, Tick02Icon } from '@hugeicons/core-free-icons';

export function CopyButton({ content, delay = 3000, className = '', ...buttonProps }) {
  const [isCopied, setIsCopied] = React.useState(false);
  const resetTimer = React.useRef(null);

  React.useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const handleCopy = React.useCallback(async () => {
    if (!content || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setIsCopied(false), delay);
    } catch {
      setIsCopied(false);
    }
  }, [content, delay]);

  return (
    <button
      {...buttonProps}
      className={`copy-button ${className}`.trim()}
      type={buttonProps.type ?? 'button'}
      onClick={handleCopy}
      aria-label={isCopied ? 'Copied to clipboard' : buttonProps['aria-label'] ?? 'Copy to clipboard'}
      title={isCopied ? 'Copied!' : 'Copy to clipboard'}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isCopied ? 'check' : 'copy'}
          className="copy-button-icon"
          initial={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          exit={{ scale: 0, opacity: 0.4, filter: 'blur(4px)' }}
          transition={{ duration: 0.25 }}
        >
          <HugeiconsIcon icon={isCopied ? Tick02Icon : Copy01Icon} strokeWidth={1.5} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
