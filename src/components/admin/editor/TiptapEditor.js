"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";
import { useCallback } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";

// ── Fix 2 & 3: CleanPaste — strips font-size from pasted HTML ────────────────
const CleanPaste = Extension.create({
  name: "cleanPaste",
  addOptions() {
    return {};
  },
  // transformPastedHTML runs before Tiptap parses the clipboard HTML
  onBeforeCreate() {},
  addProseMirrorPlugins() {
    return [];
  },
  // Use the built-in transformPastedHTML hook
}).extend({
  addOptions() {
    return {};
  },
});

// We use the editor's transformPastedHTML option instead (cleaner approach):
// See useEditor config below — transformPastedHTML is passed directly.

// ── Fix 3: FontSize — skips headings ─────────────────────────────────────────
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain, editor }) => {
          // Fix 3: Do nothing when cursor is inside a heading
          if (editor.isActive("heading")) return false;
          return chain().setMark("textStyle", { fontSize: size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    };
  },
});

// ── Toolbar button ────────────────────────────────────────────────────────────
const ToolBtn = ({ onClick, active, disabled, title, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      if (!disabled) onClick();
    }}
    disabled={disabled}
    title={title}
    className={`
      inline-flex items-center justify-center w-[30px] h-[30px] rounded-md flex-shrink-0
      border-none transition-colors duration-150
      ${active ? "bg-orange-600 text-white" : "bg-transparent text-gray-700 hover:bg-orange-50"}
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
    `}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-[22px] bg-gray-200 mx-1 flex-shrink-0" />
);

// ── Fix 2: strip font-size from pasted HTML ───────────────────────────────────
function stripFontSizeFromHTML(html) {
  // Remove font-size from all inline style attributes
  return html.replace(
    /(<[^>]+style\s*=\s*["'])([^"']*)(["'])/gi,
    (match, open, styleStr, close) => {
      const cleaned = styleStr
        .split(";")
        .filter((rule) => !/^\s*font-size\s*:/i.test(rule))
        .join(";");
      return `${open}${cleaned}${close}`;
    },
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const TiptapEditor = ({
  value,
  onChange,
  placeholder = "Start writing your content here...",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextStyle,
      FontSize, // Fix 3: heading-aware FontSize
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tiptap-link" },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    immediatelyRender: false,
    // Fix 2: strip font-size on every paste
    transformPastedHTML(html) {
      return stripFontSizeFromHTML(html);
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) return null;

  const FONT_SIZES = [
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "28px",
    "32px",
    "36px",
    "48px",
  ];

  return (
    // Fix 4: outer wrapper is a flex column with fixed height
    <div className="border-[1.5px] border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-[600px]">
      {/* Fix 4: toolbar is flex-none (never shrinks) */}
      <div className="flex-none flex flex-wrap items-center gap-0.5 px-2.5 py-2 bg-gray-50 border-b border-gray-200 z-10">
        <ToolBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo size={14} />
        </ToolBtn>
        <Divider />
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </ToolBtn>
        <Divider />
        <select
          title="Font Size"
          onChange={(e) => {
            const val = e.target.value;
            if (val) editor.chain().focus().setFontSize(val).run();
            else editor.chain().focus().unsetFontSize().run();
          }}
          className="h-7 border border-gray-200 rounded-md text-xs px-1 bg-white text-gray-700 cursor-pointer"
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Divider />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code size={14} />
        </ToolBtn>
        <Divider />
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <AlignJustify size={14} />
        </ToolBtn>
        <Divider />
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code size={14} strokeWidth={1.5} />
        </ToolBtn>
        <Divider />
        <ToolBtn
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insert / Edit Link"
        >
          <LinkIcon size={14} />
        </ToolBtn>
        <ToolBtn onClick={insertTable} title="Insert Table">
          <TableIcon size={14} />
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus size={14} />
        </ToolBtn>
        <Divider />
        <ToolBtn
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Clear Formatting"
        >
          <RemoveFormatting size={14} />
        </ToolBtn>
      </div>

      {/* Fix 4: content area is flex-1 + overflow-y-auto → scrollable */}
      <EditorContent
        editor={editor}
        className="flex-1 overflow-y-auto px-5 py-4 text-[15px] leading-relaxed text-gray-900"
      />

      {/* Fix 4: table bar is flex-none (sticks to bottom of the flex column) */}
      {editor.isActive("table") && (
        <div className="flex-none flex flex-wrap gap-1.5 px-3 py-2 bg-orange-50 border-t border-orange-200 z-10">
          {[
            {
              label: "+ Row Below",
              fn: () => editor.chain().focus().addRowAfter().run(),
            },
            {
              label: "- Delete Row",
              fn: () => editor.chain().focus().deleteRow().run(),
            },
            {
              label: "+ Col After",
              fn: () => editor.chain().focus().addColumnAfter().run(),
            },
            {
              label: "- Delete Col",
              fn: () => editor.chain().focus().deleteColumn().run(),
            },
            {
              label: "Merge Cells",
              fn: () => editor.chain().focus().mergeCells().run(),
            },
            {
              label: "Split Cell",
              fn: () => editor.chain().focus().splitCell().run(),
            },
            {
              label: "Toggle Header Row",
              fn: () => editor.chain().focus().toggleHeaderRow().run(),
            },
            {
              label: "Delete Table",
              fn: () => editor.chain().focus().deleteTable().run(),
            },
          ].map(({ label, fn }) => (
            <button
              key={label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                fn();
              }}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-orange-300 bg-white text-orange-700 cursor-pointer hover:bg-orange-50 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Editor prose styles ── */}
      <style>{`
        .ProseMirror { outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
          float: left;
          height: 0;
        }

        /* Fix 1: lock heading sizes — !important beats any inline style */
        .ProseMirror h1,
        .ProseMirror h1 * { font-size: 28px !important; font-weight: 700; }
        .ProseMirror h2,
        .ProseMirror h2 * { font-size: 22px !important; font-weight: 600; }
        .ProseMirror h3,
        .ProseMirror h3 * { font-size: 18px !important; font-weight: 600; }

        .ProseMirror h1 { margin: 12px 0 6px; }
        .ProseMirror h2 { margin: 10px 0 5px; }
        .ProseMirror h3 { margin: 8px 0 4px; }

        .ProseMirror p { margin: 0.4em 0; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; margin: 0.4em 0; }
        .ProseMirror blockquote {
          border-left: 4px solid #EA580C;
          margin: 0.8em 0;
          padding: 0.4em 1em;
          color: #6B7280;
          background: #FFF7ED;
          border-radius: 0 6px 6px 0;
        }
        .ProseMirror code {
          background: #F3F4F6;
          border-radius: 4px;
          padding: 2px 6px;
          font-family: 'Fira Code', monospace;
          font-size: 0.9em;
          color: #C2410C;
        }
        .ProseMirror pre {
          background: #1F2937;
          color: #F9FAFB;
          border-radius: 8px;
          padding: 12px 16px;
          font-family: 'Fira Code', monospace;
          font-size: 0.9em;
          overflow-x: auto;
          margin: 0.8em 0;
        }
        .ProseMirror pre code { background: none; padding: 0; color: inherit; }
        .ProseMirror hr { border: none; border-top: 2px solid #E5E7EB; margin: 1.2em 0; }
        .tiptap-link { color: #EA580C; text-decoration: underline; }
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
          border-radius: 8px;
          overflow: hidden;
          font-size: 14px;
        }
        .ProseMirror table td,
        .ProseMirror table th {
          border: 1px solid #E5E7EB;
          padding: 8px 12px;
          min-width: 80px;
          vertical-align: top;
        }
        .ProseMirror table th {
          background: #FFF7ED;
          font-weight: 600;
          color: #C2410C;
          font-size: 13px;
          letter-spacing: 0.02em;
        }
        .ProseMirror table tr:nth-child(even) td { background: #FAFAFA; }
        .ProseMirror .selectedCell { background: #FED7AA !important; }
        .ProseMirror .tableWrapper { overflow-x: auto; }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
