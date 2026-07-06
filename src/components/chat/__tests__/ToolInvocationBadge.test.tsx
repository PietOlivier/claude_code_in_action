import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge, getToolLabel } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

// getToolLabel

test("getToolLabel: str_replace_editor create", () => {
  expect(
    getToolLabel("str_replace_editor", {
      command: "create",
      path: "src/components/Counter.jsx",
    })
  ).toBe("Creating Counter.jsx");
});

test("getToolLabel: str_replace_editor str_replace", () => {
  expect(
    getToolLabel("str_replace_editor", {
      command: "str_replace",
      path: "src/App.tsx",
    })
  ).toBe("Editing App.tsx");
});

test("getToolLabel: str_replace_editor insert", () => {
  expect(
    getToolLabel("str_replace_editor", {
      command: "insert",
      path: "src/App.tsx",
    })
  ).toBe("Editing App.tsx");
});

test("getToolLabel: str_replace_editor view", () => {
  expect(
    getToolLabel("str_replace_editor", {
      command: "view",
      path: "src/App.tsx",
    })
  ).toBe("Viewing App.tsx");
});

test("getToolLabel: str_replace_editor undo_edit", () => {
  expect(
    getToolLabel("str_replace_editor", {
      command: "undo_edit",
      path: "src/App.tsx",
    })
  ).toBe("Undoing changes to App.tsx");
});

test("getToolLabel: str_replace_editor with missing args falls back", () => {
  expect(getToolLabel("str_replace_editor", {})).toBe("Editing file");
});

test("getToolLabel: file_manager rename with new_path", () => {
  expect(
    getToolLabel("file_manager", {
      command: "rename",
      path: "components/Old.jsx",
      new_path: "components/New.jsx",
    })
  ).toBe("Renaming Old.jsx to New.jsx");
});

test("getToolLabel: file_manager rename without new_path", () => {
  expect(
    getToolLabel("file_manager", {
      command: "rename",
      path: "components/Old.jsx",
    })
  ).toBe("Renaming Old.jsx");
});

test("getToolLabel: file_manager delete", () => {
  expect(
    getToolLabel("file_manager", {
      command: "delete",
      path: "components/Unused.jsx",
    })
  ).toBe("Deleting Unused.jsx");
});

test("getToolLabel: file_manager with missing args falls back", () => {
  expect(getToolLabel("file_manager", {})).toBe("Updating file");
});

test("getToolLabel: extracts basename from deeply nested path", () => {
  expect(
    getToolLabel("str_replace_editor", {
      command: "create",
      path: "src/components/ui/buttons/PrimaryButton.tsx",
    })
  ).toBe("Creating PrimaryButton.tsx");
});

test("getToolLabel: unknown tool name with and without path", () => {
  expect(
    getToolLabel("some_other_tool", { path: "foo/bar.txt" })
  ).toBe("Running some_other_tool on bar.txt");
  expect(getToolLabel("some_other_tool", {})).toBe("Running some_other_tool");
});

// ToolInvocationBadge rendering

test("ToolInvocationBadge shows spinner (not dot) while in progress", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "src/Button.jsx" },
        state: "call",
      }}
    />
  );

  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolInvocationBadge shows dot (not spinner) when result is in", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "src/Button.jsx" },
        state: "result",
        result: "Success",
      }}
    />
  );

  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolInvocationBadge handles partial-call state without throwing", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: {},
        state: "partial-call",
      }}
    />
  );

  expect(screen.getByText("Editing file")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
});

test("ToolInvocationBadge renders file_manager rename label", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "file_manager",
        args: {
          command: "rename",
          path: "components/Old.jsx",
          new_path: "components/New.jsx",
        },
        state: "result",
        result: { success: true },
      }}
    />
  );

  expect(screen.getByText("Renaming Old.jsx to New.jsx")).toBeDefined();
});

test("ToolInvocationBadge preserves outer pill classes", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={{
        toolCallId: "1",
        toolName: "str_replace_editor",
        args: { command: "create", path: "src/Button.jsx" },
        state: "call",
      }}
    />
  );

  const pill = container.firstChild as HTMLElement;
  expect(pill.className).toContain("inline-flex");
  expect(pill.className).toContain("bg-neutral-50");
  expect(pill.className).toContain("rounded-lg");
  expect(pill.className).toContain("font-mono");
  expect(pill.className).toContain("border-neutral-200");
});
