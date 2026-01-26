import { boot } from "quasar/wrappers";
import {
  VueQueryPlugin,
  QueryClient,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";

export default boot(({ app }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // 1 minute
        gcTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false, // Prevent aggressive refetching on mobile
        retry: 1, // Retry failed requests once
      },
    },
  });

  const options: VueQueryPluginOptions = {
    queryClient,
  };

  app.use(VueQueryPlugin, options);
});
