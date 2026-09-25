export const $ = <T extends Element>(selector: string) =>
  document.querySelectorAll<T>(selector);

export const $id = (id: string) => document.getElementById(id);

export const $tag = (tagName: string) => document.getElementsByTagName(tagName);

export const $name = (name: string) => document.getElementsByName(name);

export const $class = (className: string) =>
  document.getElementsByClassName(className);
