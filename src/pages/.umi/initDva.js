import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'common_mdiy', ...(require('/Users/slodon/product/java/bbc/admin/src/models/common_mdiy.js').default) });
app.model({ namespace: 'common', ...(require('/Users/slodon/product/java/bbc/admin/src/models/common.js').default) });
app.model({ namespace: 'global', ...(require('/Users/slodon/product/java/bbc/admin/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/slodon/product/java/bbc/admin/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/slodon/product/java/bbc/admin/src/models/login.js').default) });
app.model({ namespace: 'menu', ...(require('/Users/slodon/product/java/bbc/admin/src/models/menu.js').default) });
app.model({ namespace: 'project', ...(require('/Users/slodon/product/java/bbc/admin/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/slodon/product/java/bbc/admin/src/models/setting.js').default) });
app.model({ namespace: 'share', ...(require('/Users/slodon/product/java/bbc/admin/src/models/share.js').default) });
app.model({ namespace: 'user', ...(require('/Users/slodon/product/java/bbc/admin/src/models/user.js').default) });
app.model({ namespace: 'video', ...(require('/Users/slodon/product/java/bbc/admin/src/models/video.js').default) });
