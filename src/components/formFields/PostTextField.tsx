import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import DOMPurify from "dompurify";
import { useMemo } from "react";

interface PostTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

const PostTextField = ({ value, onChange, maxLength = 2200 }: PostTextFieldProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const textLength = editor.getText().length;

      if (textLength <= maxLength) {
        const cleanHtml = DOMPurify.sanitize(editor.getHTML());
        onChange(cleanHtml);
      }
    },
  });

  const characterCount = useMemo(() => {
    return editor?.getText().length ?? 0;
  }, [editor?.getText()]);

  if (!editor) return null;

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          p: 1,
          "&:focus-within": {
            borderColor: "primary.main",
            boxShadow: "0 0 0 1px",
          },
        }}
      >
        {/* Toolbar */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive("bold") ? "primary" : "default"}
          >
            <FormatBoldIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive("italic") ? "primary" : "default"}
          >
            <FormatItalicIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive("bulletList") ? "primary" : "default"}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Editor */}
        <EditorContent
          editor={editor}
          style={{
            minHeight: 120,
            outline: "none",
          }}
        />
      </Paper>

      {/* Character Counter */}
      <Typography
        variant="caption"
        sx={{
          float: "right",
          mt: 0.5,
          color: characterCount > maxLength * 0.9 ? "error.main" : "text.secondary",
        }}
      >
        {characterCount}/{maxLength}
      </Typography>
    </Box>
  );
};

export default PostTextField;
