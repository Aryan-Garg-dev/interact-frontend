const ThemeCheck = () => {
  const userTheme = localStorage.getItem('theme');
  // const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // if (userTheme === 'dark' || (!userTheme && systemTheme)) {
  //   document.documentElement.classList.add('dark');
  //   if (userTheme !== 'dark') localStorage.setItem('theme', 'dark');
  // } else {
  //   if (userTheme !== 'light') localStorage.setItem('theme', 'light');
  // }

  // if (userTheme && userTheme == 'dark') document.documentElement.classList.add('dark');
  // else {
  //   if (userTheme !== 'light') localStorage.setItem('theme', 'light');
  // }
};

export default ThemeCheck;
