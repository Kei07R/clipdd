const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('EXPO_PUBLIC_API_URL is not set. Add it to your .env file.');
}

export type StyleResult = {
  style: string;
  label: string;
  imageUrl?: string;
  error?: string;
};

export async function generateStyles(
  imageUri: string,
  styleKeys: string[],
  customPrompt?: string
): Promise<StyleResult[]> {
  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  } as any);

  formData.append('styles', styleKeys.join(','));

  if (customPrompt) {
    formData.append('customPrompt', customPrompt);
  }

  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.results as StyleResult[];
}
