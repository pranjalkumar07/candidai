import Vapi from "@vapi-ai/web";

let vapiInstance: Vapi | null = null;

export const getVapi = (): Vapi | null => {
  if (!vapiInstance && typeof window !== "undefined") {
    const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "";
    vapiInstance = new Vapi(token);
  }
  return vapiInstance;
};

export const vapi: Vapi = new Proxy({} as Vapi, {
  get(_target, prop: keyof Vapi) {
    const instance = getVapi();
    if (!instance) {
      return () => {};
    }
    const value = instance[prop];
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
