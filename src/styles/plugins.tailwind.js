export const transitions = ({ theme, addUtilities }) => {
  const utilities = {};
  const durations = theme('durations');
  for (const duration in durations) {
    utilities[`.transition-ease-${duration}`] = {
      transition: `all ${duration} ease-in-out`,
    };
  }
  addUtilities(utilities);
};
