import {nextTick, ref} from 'vue'

export function useElementRect(ElRef) {
    const width = ref(0)
    const height = ref(0)
    const x = ref(0)
    const y = ref(0)

    nextTick(() => {
        const {width: W, height: H, x: X, y: Y, bottom, left, right, top} = ElRef.value.getBoundingClientRect()
        console.log(ElRef.value.getBoundingClientRect());
        width.value = W
        height.value = H
        x.value = X
        y.value = Y
    })


    return {
        width,
        height,
        x,
        y
    }
};