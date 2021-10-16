import { MemoryCard }  from 'memory-card'

import type {
  PuppetSkelton,
}                   from '../puppet/skelton.js'

import {
  log,
}           from '../config.js'

const memoryMixin = <MixinBase extends typeof PuppetSkelton>(mixinBase: MixinBase) => {

  abstract class MemoryMixin extends mixinBase {

    #memory: MemoryCard

    get memory (): MemoryCard {
      return this.#memory
    }

    constructor (...args: any[]) {
      super(...args)
      log.verbose('PuppetMemoryMixin', 'constructor()')
      this.#memory = new MemoryCard()
    }

    override async start (): Promise<void> {
      log.verbose('PuppetMemoryMixin', 'constructor()')
      await this.memory.load()
      await super.start()
    }

    override async stop (): Promise<void> {
      log.verbose('PuppetMemoryMixin', 'constructor()')
      await super.stop()
    }

    setMemory (memory: MemoryCard): void {
      log.verbose('PuppetMemoryMixin', 'setMemory(%s)', memory.name)

      if (this.#memory.name) {
        throw new Error('Puppet memory can be only set once')
      }
      this.#memory = memory
    }

  }

  return MemoryMixin
}

type MemoryMixin = ReturnType<typeof memoryMixin>

type ProtectedPropertyMemoryMixin = never
  | 'memory'

export type {
  MemoryMixin,
  ProtectedPropertyMemoryMixin,
}
export { memoryMixin }