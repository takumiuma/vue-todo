// importファイルをtypescriptとして認識させるための宣言ファイル
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@jamescoyle/vue-icon'
declare module 'vuetify/components'
