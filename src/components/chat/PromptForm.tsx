import { useRef, useState } from "react";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import { classNames } from "@/utils/classNames";
import { StopIcon, MagicWandIcon } from "@radix-ui/react-icons";

export function PromptForm({
  onSubmit,
  isLoading,
  onAbort,
}: {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  onAbort: () => void;
}) {
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  const clearContent = () => {
    setPrompt("");
    if (inputRef.current) {
      inputRef.current.textContent = "";
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt && !isLoading) {
      onSubmit(prompt);
      clearContent();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt && !isLoading) {
        onSubmit(prompt);
        clearContent();
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setPrompt(e.currentTarget.textContent || "");
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
      <Flex position="absolute" bottom="0" right="0" p="4" gap="2">
        {isLoading && (
          <IconButton size="3" type="button" onClick={onAbort} variant="soft">
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
