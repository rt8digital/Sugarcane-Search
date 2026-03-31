declare module 'pdfjs-dist/build/pdf' {
  const pdfjs: any;
  export = pdfjs;
}

declare module '*?worker' {
  const workerConstructor: {
    new (): Worker;
  };
  export default workerConstructor;
}
