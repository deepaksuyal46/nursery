declare module 'aos' {
  type AOSOptions = {
    duration?: number;
    once?: boolean;
    offset?: number;
    easing?: string;
    disable?: boolean | (() => boolean);
  };

  const AOS: {
    init(options?: AOSOptions): void;
    refresh(): void;
    refreshHard(): void;
  };

  export default AOS;
}
