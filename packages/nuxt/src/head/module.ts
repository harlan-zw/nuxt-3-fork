import { resolve } from 'pathe'
import { addComponent, addImportsSources, addPlugin, defineNuxtModule, addVitePlugin } from '@nuxt/kit'
import UnheadVite from '@unhead/addons/vite'
import { distDir } from '../dirs'

const components = ['NoScript', 'Link', 'Base', 'Title', 'Meta', 'Style', 'Head', 'Html', 'Body']

export default defineNuxtModule({
  meta: {
    name: 'meta'
  },
  setup (options, nuxt) {
    const runtimeDir = nuxt.options.alias['#head'] || resolve(distDir, 'head/runtime')

    // Transpile @nuxt/meta and @vueuse/head
    nuxt.options.build.transpile.push('@vueuse/head')

    // Add #head alias
    nuxt.options.alias['#head'] = runtimeDir

    addImportsSources({
      from: '@vueuse/head',
      imports: [
        'useSeoMeta',
        'injectHead',
        'useServerHead'
      ]
    })

    // removes server composables in client build
    addVitePlugin(UnheadVite({ root: nuxt.options.rootDir }))

    // Register components
    const componentsPath = resolve(runtimeDir, 'components')
    for (const componentName of components) {
      addComponent({
        name: componentName,
        filePath: componentsPath,
        export: componentName,
        // kebab case version of these tags is not valid
        kebabName: componentName
      })
    }

    // Add library specific plugin
    addPlugin({ src: resolve(runtimeDir, 'lib/vueuse-head.plugin') })
  }
})
