import { SVGProps as ReactSVGProps } from "react";

type SVGProps = ReactSVGProps<SVGSVGElement>;

export const CheckmarkIcon = (props: SVGProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
    </svg>
  );
};

export const XmarkIcon = (props: SVGProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" {...props}>
      <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z" />
    </svg>
  );
};

export const EraserIcon = (props: SVGProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
      <path d="M258.7 57.4L25.4 290.7c-25 25-25 65.5 0 90.5l80 80c12 12 28.3 18.7 45.3 18.7H256h9.4H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H355.9L486.6 285.3c25-25 25-65.5 0-90.5L349.3 57.4c-25-25-65.5-25-90.5 0zM265.4 416H256l-105.4 0-80-80L195.3 211.3 332.7 348.7 265.4 416z" />
    </svg>
  );
};
