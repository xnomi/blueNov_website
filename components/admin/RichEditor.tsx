"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";
import {
  Bold, Italic, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Heading3, Minus, Quote, Undo, Redo, Link2, ImageIcon,
} from "lucide-react";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const ToolbarButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title?: string }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    style={{
      padding: "0.35rem",
      borderRadius: "5px",
      border: "none",
      background: active ? "var(--accent)" : "transparent",
      color: active ? "#fff" : "var(--text-secondary)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      transition: "all 0.15s ease",
    }}
    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
  >
    {children}
  </button>
);

const Sep = () => <div style={{ width: "1px", height: "20px", background: "var(--border-color)", margin: "0 0.25rem" }} />;

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Start writing your content here..." }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "rich-editor-content",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content]);

  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const setLink = () => {
    const url = prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  };

  return (
    <div style={{ border: "1px solid var(--border-color)", borderRadius: "8px", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.1rem",
        padding: "0.5rem",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border-color)",
        alignItems: "center",
      }}>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strike">
          <Strikethrough size={15} />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
          <Heading1 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
          <Heading3 size={15} />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
          <Quote size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus size={15} />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Add Link">
          <Link2 size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
          <ImageIcon size={15} />
        </ToolbarButton>
        <Sep />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={15} />
        </ToolbarButton>
      </div>

      {/* Editor area */}
      <div style={{ minHeight: "320px", padding: "1rem", background: "var(--bg-primary)" }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .rich-editor-content { outline: none; min-height: 300px; }
        .rich-editor-content p { margin-bottom: 1em; }
        .rich-editor-content h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 0.75em; }
        .rich-editor-content h2 { font-size: 1.375rem; font-weight: 600; margin-bottom: 0.5em; }
        .rich-editor-content h3 { font-size: 1.15rem; font-weight: 600; margin-bottom: 0.5em; }
        .rich-editor-content ul { list-style: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .rich-editor-content ol { list-style: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .rich-editor-content blockquote { border-left: 3px solid var(--accent); padding-left: 1rem; margin: 1em 0; color: var(--text-secondary); font-style: italic; }
        .rich-editor-content hr { border: none; border-top: 1px solid var(--border-color); margin: 1.5em 0; }
        .rich-editor-content a { color: var(--accent); text-decoration: underline; }
        .rich-editor-content img { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        .rich-editor-content p.is-editor-empty:first-child::before { color: var(--text-muted); content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
      `}</style>
    </div>
  );
}
