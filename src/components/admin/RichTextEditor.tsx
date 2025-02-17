import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

class UploadAdapter {
  private loader: any;
  private toast: any;

  constructor(loader: any, toast: any) {
    this.loader = loader;
    this.toast = toast;
  }

  async upload() {
    try {
      const file = await this.loader.file;
      
      if (!file.type.startsWith('image/')) {
        this.toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload an image file",
        });
        throw new Error('Invalid file type');
      }

      if (file.size > 5 * 1024 * 1024) {
        this.toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
        });
        throw new Error('File too large');
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) {
        this.toast({
          variant: "destructive",
          title: "Upload failed",
          description: uploadError.message,
        });
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      this.toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      return {
        default: publicUrlData.publicUrl
      };
    } catch (error: any) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  abort() {
    console.log('Upload aborted');
  }
}

export function RichTextEditor({ content = '', onChange }: RichTextEditorProps) {
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.getData()) {
      try {
        const safeContent = typeof content === 'string' ? content : '';
        editorRef.current.setData(safeContent);
      } catch (error) {
        console.error('Error setting editor data:', error);
        editorRef.current?.setData('');
      }
    }
  }, [content]);

  const handleReady = (editor: any) => {
    editorRef.current = editor;
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new UploadAdapter(loader, toast);
    };
    
    try {
      const safeContent = typeof content === 'string' ? content : '';
      editor.setData(safeContent);
    } catch (error) {
      console.error('Error in editor ready:', error);
      editor.setData('');
    }
  };

  const handleEditorChange = (_event: any, editor: any) => {
    if (!editor) {
      console.warn('Editor instance not available');
      return;
    }
    
    try {
      const data = editor.getData();
      onChange(data || '');
    } catch (error) {
      console.error('CKEditor error:', error);
      onChange('');
    }
  };

  return (
    <div className="border rounded-md min-h-[400px]">
      <CKEditor
        editor={ClassicEditor}
        data={typeof content === 'string' ? content : ''}
        onReady={handleReady}
        onChange={handleEditorChange}
        config={{
          toolbar: {
            items: [
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              'bulletedList',
              'numberedList',
              '|',
              'outdent',
              'indent',
              '|',
              'imageUpload',
              'blockQuote',
              'insertTable',
              'mediaEmbed',
              'undo',
              'redo'
            ],
            shouldNotGroupWhenFull: true
          },
          heading: {
            options: [
              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
            ]
          },
          image: {
            toolbar: ['imageTextAlternative'],
            resizeOptions: [
              {
                name: 'imageResize:original',
                value: null,
                label: 'Original'
              },
              {
                name: 'imageResize:50',
                value: '50',
                label: '50%'
              },
              {
                name: 'imageResize:75',
                value: '75',
                label: '75%'
              }
            ],
            styles: {
              options: ['full', 'side', 'alignLeft', 'alignCenter', 'alignRight']
            }
          }
        }}
      />
    </div>
  );
}