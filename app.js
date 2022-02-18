let app = Vue.createApp({
    data: function() {
        return {
            greeting: 'Hello test',
            isVisible: false
        }
    },
    methods: {
        toggleView() {
            this.isVisible = !this.isVisible
        },
        greet(greeting) {
            console.log("test greeting enter var --> ", greeting)
        }
    },
    updated() {
        console.log('updated')
    }


})

app.component('navbar',{
    template:
    `
    <div class="navbar">
        <i class="bi bi-house-fill fa-10x" @click="redirectTo('127.0.0.1')">home</i>
    </div>
    `,
    methods: {
        redirectTo(page){
        console.log('redirecting to: '+page)
        router.push(page)
    }
    }
 
})

app.component('products',{
    template: `
    <table>
        <tr>
            <td v-for="(prod, i) in products">
                <div  class="row">
                    <div class="inbl card col">
                    
                        <div class="card-body">
                            <h5 class="card-title">{{prod.name}}</h5>
                            <p class="card-text">Prezzo: {{prod.price}}</p>
                            <button @click="addToCart(i)" class="btn btn-primary">Aggiungi al carrello</button>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <h1>Carrello:</h1>
    <div v-if="cart.length>0">
        <span v-for="(cProd,index) in cart">
            {{cProd.name}} {{cProd.price}} x {{cProd.quantity}} = {{cProd.priceCart}} €<i class="bi bi-trash-fill" @click="deleteItem(index)"></i> <br/>
        </span>

    </div>
    <button @click="getTotal()">Calcola totale</button>
    <div v-if="isTotalVisible">
    <h1>Totale: {{total}}</h1>
    </div>
    `,
    data(){
        return{
            total:0,
            isTotalVisible:false,
            cart:[],
            products: [
                {
                    name:'banana',
                    image:'https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg',
                    price:'1.20',
                   
                }, 
                {
                    name:'carota',
                    image:'https://d21mug5vzt7ic2.cloudfront.net/s24/86588/resize/86588_1.jpg',
                    price:'1.10',
                   
                },
                {
                    name:'mela',
                    image:'https://www.antoniopaolillo.com/wp-content/uploads/2020/03/mela-rossa-1-scaled.jpg',
                    price:'1.00',
                   
                },
                {
                    name:'pomodoro',
                    image:'https://www.finagricola.it/wp-content/uploads/2020/02/pomodoro-oblungo-rosso2-1.jpg',
                    price:'0.80',
                   
                },
                {
                    name:'broccolo',
                    image:'https://consumatori.e-coop.it/wp-content/uploads/2017/01/Broccoli-BIG.png',
                    price:'1.50',
                   
                },
                {
                    name:'pesca',
                    image:'https://www.biotipioberhammer.it/wp-content/uploads/2019/08/pesca-frutto-depurante.jpg',
                    price:'1.30',
                   
                }
            ]
        }
    },
    methods:{

        addToCart(index){
            if(!this.cart.includes(this.products[index])){
                this.cart.push(this.products[index])
                let prodIndex=this.cart.indexOf(this.products[index])
                this.cart[prodIndex].quantity=1;
                let price=this.products[index].price;
                this.cart[prodIndex].priceCart=price
            }else{
                let prodIndex=this.cart.indexOf(this.products[index])
                this.cart[prodIndex].quantity+=1;
                let price=this.products[index].price;
                let quantity=this.cart[prodIndex].quantity;
                this.cart[prodIndex].priceCart=price*quantity
            }
        },

        deleteItem(index){
                let quantityC=this.cart[index].quantity;
                quantityC=quantityC-1;
                this.cart[index].quantity=quantityC

                if(this.cart[index].quantity===0){
                    this.cart.splice(index,1);
                }else{
                    let prodPrice=this.products[index].price
                    this.cart[index].priceCart=prodPrice*quantityC
                }
            
        },

        getTotal(){
            this.isTotalVisible=false;
            let total=0;
            this.cart.forEach(element => {
                total+=element.priceCart
            });

            this.total=total;
            this.isTotalVisible=true;
        }


    }

})




app.component('test-box', {
    template: `
    <div class="box">
        text-box
        </div>
    `,
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    unmounted() {
        console.log('unmounted')
    }
})

//due parametri
//il primo è il nome
//il secondo options object
app.component('custom-form', {
    template: `
    <form @submit.prevent="handleSubmit">  <!-- .prevent è per non fare ricaricare la pagina al click del bottone-->
        <h1>{{title}}</h1>
        <custom-input 
        v-for="(input, i) in inputs"
        :key="i"
        :label="input.label"  
        :type="input.type"
        v-model="input.value"/> <br/><!--v-bind:label o più semplicemente :label è utilizzato per prendere l'etichetta dal componente sotto-->
        <button type="submit">Log in</button>
    </form>
    `,
    components: ['custom-input'],
    data() {
        return {
            title: 'Login form',
            email: '',
            password: '',
            emailLabel: 'Email',
            passwordLabel: 'Password',
            inputs: [{
                    label: 'Email',
                    value: '',
                    type: 'email'
                },
                {
                    label: 'Password',
                    value: '',
                    type: 'password'
                },
            ]
        }
    },
    methods: {
        handleSubmit() {
            console.log('form submitted\nemail: ' + this.inputs[0].value + '\npassword: ' + this.inputs[1].value)
        }
    }
})

app.component('custom-input', {
    template: `
        <label>
            {{label}}
            <input :type="type" v-model="inputValue"> <!--v-model è l'equivalente del ngModel-->
        </label>
    `,
    props: ['label', 'type', 'modelValue'], //modelValue serve per ricevere valori dal parent
    computed: {
        inputValue: { //input value è un nome custom definito nel v-model del figlio
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value) //emitta gli eventi che altri component possono ascoltare. v-model del parent sta ascoltando questo emit
            }
        }
    },

    // data(){
    //     return{
    //         inputValue: ''
    //     }
    // }
})

app.mount('#app')