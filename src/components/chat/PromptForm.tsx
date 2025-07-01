import { useRef, useState } from "react";
import { Box, Button, Flex, IconButton } from "@radix-ui/themes";
import {
  StopIcon,
  MagicWandIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";

import { classNames } from "@/utils/classNames";

export function PromptForm({
  isLoading,
  onSubmit,
  onAbort,
  onClearSession,
}: {
  isLoading: boolean;
  onSubmit: (prompt: string) => string;
  onAbort: (id: string) => void;
  onClearSession: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);
  const pendingId = useRef<string | null>(null);

  const clearContent = () => {
    setPrompt("");
    if (inputRef.current) {
      inputRef.current.textContent = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt && !isLoading) {
      pendingId.current = onSubmit(prompt);
      clearContent();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt && !isLoading) {
        pendingId.current = onSubmit(prompt);
        clearContent();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setPrompt(e.currentTarget.textContent || "");
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ position: "relative", width: "100%" }}
    >
      <Box
        ref={inputRef}
        className={classNames("prompt-input", !prompt && "empty")}
        as="div"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label="Meal prompt"
        aria-multiline="true"
        aria-disabled={isLoading}
        tabIndex={0}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        style={{
          width: "100%",
          minHeight: "120px",
          borderRadius: "var(--radius-5)",
          padding: "var(--space-4)",
          paddingBottom: "64px",
          boxShadow: "var(--shadow-3)",
          backgroundColor: "var(--color-panel-solid)",
          color: "var(--color-foreground)",
          fontSize: "var(--font-size-3)",
          lineHeight: "var(--line-height-3)",
        }}
        data-placeholder="Generate meals for a lunch with tomato, chicken, and rice..."
      />
      <Flex
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        p="4"
        gap="2"
        justify="between"
        align="center"
      >
        <Button
          type="button"
          onClick={onClearSession}
          variant="ghost"
          color="gray"
        >
          <CrossCircledIcon />
          Clear session
        </Button>
        {isLoading && (
          <IconButton
            size="3"
            type="button"
            onClick={() => onAbort(pendingId.current || "")}
            variant="soft"
          >
            <StopIcon />
          </IconButton>
        )}
        {!isLoading && (
          <IconButton size="3" type="submit">
            <MagicWandIcon />
          </IconButton>
        )}
      </Flex>
    </form>
  );
}
