import { alpha } from "@mui/material/styles";
import type { CSSObject, Theme } from "@mui/material/styles";

export const scrollbarStyles = (theme: Theme): CSSObject => {
  const thumb = alpha(theme.palette.text.primary, 0.2);
  const hoverThumb = alpha(theme.palette.text.primary, 0.35);

  return {
    scrollbarWidth: "thin",
    scrollbarColor: `${thumb} transparent`,
    "&:hover, &:focus-within": {
      scrollbarColor: `${hoverThumb} transparent`,
    },
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: thumb,
      borderRadius: "8px",
      border: "2px solid transparent",
      backgroundClip: "padding-box",
    },
    "&:hover::-webkit-scrollbar-thumb, &:focus-within::-webkit-scrollbar-thumb": {
      backgroundColor: hoverThumb,
    },
    "&::-webkit-scrollbar-corner": {
      backgroundColor: "transparent",
    },
  };
};
