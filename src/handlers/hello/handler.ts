console.log("This is logged at handler's initialization.");

export const handler = function () {
  console.log("This is logged on handler call.")
  return { text: 'Hello, World!' };
}
