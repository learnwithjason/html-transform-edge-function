import { HTMLRewriter } from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts';

let buffer = '';
export default async (request, context) => {
  const url = new URL(request.url);
  if (url.searchParams.get('transform') === 'false') {
    return context.next();
  }

  const response = await context.next();

  return new HTMLRewriter()
    .on('*', {
      text(text) {
        buffer += text.text;

        if (text.lastInTextNode) {
          text.replace(buffer.replace(/pizza/gi, 'TACOS'));
          buffer = '';
        } else {
          text.remove();
        }
      },
    })
    .on('img', {
      element(element) {
        const classes = element.getAttribute('class');

        let newSrc = false;
        let newAlt = false;
        if (classes.includes('cheesy')) {
          newSrc =
            'https://images.unsplash.com/photo-1464219222984-216ebffaaf85?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80&ar=0.85:1&crop=entropy';
          newAlt = 'hands pulling chips from a cheesy pile of nachos';
        } else if (classes.includes('salty')) {
          newSrc =
            'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80&ar=0.85:1&crop=entropy';
          newAlt = 'a close-up of nachos on a plate';
        }

        if (newSrc) {
          element.setAttribute('src', newSrc);
          element.setAttribute('alt', newAlt);
        }
      },
    })
    .transform(response);
};
