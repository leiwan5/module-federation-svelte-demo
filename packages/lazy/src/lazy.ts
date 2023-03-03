import type { SvelteComponentTyped } from 'svelte';
import Lazy from './Lazy.svelte';

export default function lazy<T = SvelteComponentTyped>(provider) {
    return function (opts) {
        return new Lazy({
            ...opts,
            props: {
                component: provider,
                ...opts.props,
            }
        })
    } as T
}