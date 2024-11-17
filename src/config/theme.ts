const ThemeCheck = () => {
  // Check if window and localStorage are available (e.g., to avoid issues in SSR scenarios)
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  const userTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // if (userTheme === 'dark' || (!userTheme && systemPrefersDark)) {
  //   document.documentElement.classList.add('dark');
  //   if (userTheme !== 'dark') localStorage.setItem('theme', 'dark');
  // } else {
  //   document.documentElement.classList.remove('dark');
  //   if (userTheme !== 'light') localStorage.setItem('theme', 'light');
  // }
};

export default ThemeCheck;
