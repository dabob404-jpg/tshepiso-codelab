export interface GeneratedFile {
  name: string;
  language: string;
  content: string;
}

export interface GenerationResponse {
  success: boolean;
  title: string;
  language: string;
  files: GeneratedFile[];
  explanation: string;
  runnable: boolean;
  error?: string;
}

export interface GenerationRequest {
  prompt: string;
  mode?: 'generate' | 'fix' | 'explain';
  existingCode?: string;
}
