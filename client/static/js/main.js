Vue.component('input-card', {
    template: `
    <form class="card" v-on:submit.prevent autocomplete="off">
        <div class="desc">
            <h3 class="primary-text">
                F 1200 Document Generator
            </h3>
            <!-- <h6 class="secondary-text phrase">Plase enter window dimensions:</h6> -->
        </div>
        <div class="form">
            <div class="input-fields">
                <!-- Input fields -->
                <label for="height" class="secondary-text">Window Height [mm]*</label>
                <input id='height' class="input-num" v-model="payload.height"
                type="text" required
                >
                <label for="width" class="secondary-text">Window Width [mm]*</label>
                <input id='width' class="input-num" v-model="payload.width"
                type="text" required
                >
                <label class="secondary-text drdo-drive" 
                for="drives">Select Product*</label>
                <select class="drop-down" id="drives" v-model="payload.product" required>
                <option v-for="product in products" :value="product">{{ product }}</option>
                </select>

                <label class="secondary-text drdo-drive" 
                for="drives">Select Variant*</label>
                <select class="drop-down" id="variants" v-model="payload.variant" required>
                <option v-for="variant in variants" :value="variant">{{ variant }}</option>
                </select>

                <label class="secondary-text">Drive Offsets [mm]</label>
                <div class="coordinates">
                    <div class="c-left-lbl"><span class="secondary-text">X</span></div>
                    <input class="c-left" type="text"
                    v-model="xshift"
                    >
                    <div class="c-right-lbl"><span class="secondary-text">Y</span></div>
                    <input class="c-right" type="text"
                    v-model="yshift"
                    >
                </div>
            </div>
            <!-- Select custom drive pos 
            <div class="drive-pos">
                <label class="container">One
                    <input type="checkbox" checked="checked">
                    <span class="checkmark"></span>
                </label>
            </div> -->
        </div>
        <button class="details" @click="fetchPDF">
            <div class="calculate-text">
            <h6 class="primary-text">Download PDF</h6>
            </div>
        </button>
    </form>
    `,
    data () {
        return {
            results: null,
            payload: {
              height: null,
              width: null,
              product: null,
              variant: null,
            },
            products: ['F1200', 'F1200+'],
            variants: ['horizontal', 'vertical'],
            xshift: null,
            yshift: null,
        }
    },
    methods: {
        fetchResults() {
            // prevents api call if there are missing values
            for(const key of Object.keys(this.payload)){
                if ((this.payload[key] === null || this.payload[key] === "")
                && !['xshift', 'yshift'].includes(key)) {
                    return
                }
            }

            this.payload['xshift'] = this.xshift
            this.payload['yshift'] = this.yshift

            // call api endpoint
            const api = "http://localhost/api/hello"
            fetch(api, {
                "method": "POST",
                "headers": {
                    'Content-Type': 'application/json',
                },
                "body": JSON.stringify(this.payload),
            })
            .then(response => response.json())
            .then(data => this.$emit('transfer-results', data))
        },
        fetchPDF() {
            // prevents api call if there are missing values
            for(const key of Object.keys(this.payload)){
                if ((this.payload[key] === null || this.payload[key] === "")
                && !['xshift', 'yshift'].includes(key)) {
                    return
                }
            }
            this.payload['xshift'] = this.xshift
            this.payload['yshift'] = this.yshift

            // call api endpoint
            const api = "http://ec2-18-212-244-9.compute-1.amazonaws.com:8000/api/pdfgen"
            fetch(api, {
                "method": "POST",
                "headers": {
                    'Content-Type': 'application/json',
                    'X-API-KEY': '64jczk80AdORfm8tgnqF7IyoNqGgzAI3'
                },
                "body": JSON.stringify(this.payload),
            })
            .then(response => response.blob())
            .then(blob => {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.download = "ouput.pdf";
                // append element to the dom -> otherwise will not work in firefox
                document.body.appendChild(a); 
                a.click();
                // removing element after completion
                a.remove();      
            });
        }
    }
})


var app = new Vue({
    el: '#app',
    data () {
        return {
            result: null
        }
    },
    methods: {
        parseResults(data) {
            this.result = data
            console.log(this.result)
        },
    }
})
