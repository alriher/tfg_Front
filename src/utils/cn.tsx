export const cn = (...args: Array<string | { [key: string]: boolean }>): string => {
  const classes: string[] = [];

  args.forEach(arg => {
    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object' && arg !== null) {
      Object.keys(arg).forEach(className => {
        if (arg[className]) {
          classes.push(className);
        }
      });
    }
  });

  return classes.join(' ');
};