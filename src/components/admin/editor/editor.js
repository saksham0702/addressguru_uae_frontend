"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// ✅ TinyMCE dynamic import (Next.js safe)
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false },
);

export default function TinyEditor({ value, onChange }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const API_KEY = "hmeo9m8jk6qe1koakdk1zhdhwccwe5jypb2h887ct52jmyn6";

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-400/40">
      <Editor
        apiKey={API_KEY}
        tinymceScriptSrc={`https://cdn.tiny.cloud/1/${API_KEY}/tinymce/6/tinymce.min.js`}
        value={value || ""}
        onEditorChange={(newContent) => onChange(newContent)}
        init={{
          height: 500,
          menubar: true,

          menubar: "file edit view insert format tools table help",

          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "media",
            "table",
            "code",
            "fullscreen",
            "preview",
            "paste",
          ],

          toolbar:
            "undo redo | blocks | bold italic underline | " +
            "alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | link image media table | " +
            "preview fullscreen code",

          // ✅ BASE64 IMAGE SUPPORT
          paste_data_images: true, // paste images
          automatic_uploads: false, // disable backend upload

          file_picker_types: "image",

          // ✅ LOCAL IMAGE PICKER (BASE64)
          file_picker_callback: (callback, value, meta) => {
            if (meta.filetype === "image") {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");

              input.onchange = function () {
                const file = this.files[0];

                const reader = new FileReader();
                reader.onload = function () {
                  callback(reader.result, {
                    alt: file.name,
                  });
                };

                reader.readAsDataURL(file); // ✅ convert to base64
              };

              input.click();
            }
          },

          // ✅ CLEAN PASTE
          paste_as_text: false,
          paste_auto_cleanup_on_paste: true,

          // ✅ UI improvements
          branding: false,
          statusbar: false,
          resize: true,

          // ✅ Optional: restrict formats
          images_file_types: "jpg,jpeg,png,webp",
        }}
      />
    </div>
  );
}
