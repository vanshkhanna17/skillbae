export const stringToColor = (string: string) => {
  let hash = 0;

  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;

  return `hsl(${hue}, 65%, 55%)`;
};

export const stringAvatar = (name: string) => {
  const parts = name.trim().split(/\s+/);

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0],
  };
};
