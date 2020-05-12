import FontFaceObserver from 'fontfaceobserver';

export const handleFontLoading = async () => {
  const link = document.createElement('link');
  link.href =
    'https://fonts.googleapis.com/css2?family=Fira+Code&family=Inter:wght@400;500;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
  const inter = new FontFaceObserver('Inter');
  const fira = new FontFaceObserver('Fira Code');

  await Promise.all([inter.load(), fira.load()]);
  document.documentElement.classList.add('fonts-loaded');
};
