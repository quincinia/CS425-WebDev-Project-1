// backticks not working right, so defining the templates outside
let edit_button_template = `
    <div class="button edit" v-on:click="signal_edit">
        Edit
    </div>
`
let delete_button_template = `
    <div class="button delete" v-on:click="signal_delete">
        Delete
    </div>
`
let info_template = `
    <li>
        <div class="info-container">
            <p>Name: {{ name }}</p>
            <p>Email: <a href="#">{{ email }}</a></p>
            <p>Phone: {{ phone }}</p>
            <p>Description: {{ description }}</p>
        </div>
        <edit-button v-bind:index="index"></edit-button>
        <delete-button v-bind:index="index"></delete-button>
    </li>
`
let info_form_template = `
    <form v-on:submit.prevent="signal_update">
        <div class="row">
            <label for="name">Name:</label>
            <input type="text" name="name" v-model="name"/>
        </div>

        <div class="row">
            <label for="email">Email:</label>
            <input type="text" name="email" v-model="email"/>
        </div>

        <div class="row">
            <label for="phone">Phone:</label>
            <input type="text" name="phone" v-model="phone"/>
        </div>

        <div class="row">
            <label for="description">Description:</label>
            <input type="text" name="description" v-model="description"/>
        </div>

        <button type="submit">Submit</button>
    </form>
`

Vue.component('edit-button', {
    props: ['index'],
    methods: {
        signal_edit: function () {
            console.log('editing: ' + this.index)
            console.log(this.$root)
            this.$root.edit_contact(this.index)
        },
    },
    template: edit_button_template,
})

Vue.component('delete-button', {
    props: ['index'],
    methods: {
        signal_delete: function () {
            this.$root.delete_contact(this.index)
        },
    },
    template: delete_button_template,
})

Vue.component('info-card', {
    props: ['index', 'name', 'email', 'phone', 'description'],
    template: info_template,
})

Vue.component('info-form', {
    props: ['form_data'],
    data: function () {
        console.log(this.form_data)
        return {
            name: this.form_data.name,
            email: this.form_data.email,
            phone: this.form_data.phone,
            description: this.form_data.description,
        }
    },
    watch: {
        form_data: {
            immediate: true,
            deep: true,
            handler: function (new_data) {
                console.log('updating form')
                this.name = new_data.name
                this.email = new_data.email
                this.phone = new_data.phone
                this.description = new_data.description
            },
        },
    },
    methods: {
        signal_update: function () {
            let curr_data = {
                name: this.name,
                email: this.email,
                phone: this.phone,
                description: this.description,
            }
            this.$root.update_list(curr_data)
        },
    },
    template: info_form_template,
})

let app = new Vue({
    el: '#app',
    data: {
        contacts: [
            {
                name: 'Joey',
                email: 'J@gmail.com',
                phone: '775-162-1620',
                description: 'Needed help',
            },
            {
                name: 'Paul',
                email: 'P@gmail.com',
                phone: '775-155-1620',
                description: 'Needed help',
            },
            {
                name: 'Jerry',
                email: 'JP@gmail.com',
                phone: '775-155-1434',
                description: 'Needed the manager',
            },
        ],
        edit_index: -1,
        form_data: {
            name: '',
            email: '',
            phone: '',
            description: '',
        },
        fill_form: 1,
    },
    methods: {
        clear_form: function () {
            this.form_data = {
                name: '',
                email: '',
                phone: '',
                description: '',
            }
            this.fill_form += 1
        },
        edit_contact: function (index) {
            console.log('caught edit event')
            this.edit_index = index
            let i = this.edit_index
            if (i < 0) {
                this.clear_form()
            } else {
                this.form_data.name = this.contacts[i].name
                this.form_data.email = this.contacts[i].email
                this.form_data.phone = this.contacts[i].phone
                this.form_data.description = this.contacts[i].description
            }
            console.log(this.form_data)
            this.fill_form += 1
        },
        delete_contact: function (index) {
            this.contacts.splice(index, 1)
            this.edit_index = -1
            this.clear_form()
        },
        update_list: function (info) {
            console.log('updating: ' + this.edit_index)
            console.log('info: ' + JSON.stringify(info))
            if (this.edit_index < 0) {
                this.contacts.push(info)
            } else {
                this.contacts.splice(this.edit_index, 1, info)
            }
            this.clear_form()
            this.edit_index = -1
        },
    },
})
