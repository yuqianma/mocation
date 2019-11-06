<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        xs="12"
        sm="8"
        md="6"
        lg="4"
        xl="4"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form id="login" @submit="onSubmit">
              <v-text-field
                label="Name"
                name="name"
                prepend-icon="person"
                type="text"
              ></v-text-field>
              <v-text-field
                label="Password"
                name="password"
                prepend-icon="lock"
                type="password"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" form="login" color="primary" >Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>

<script>
import { mapMutations, mapActions } from 'vuex';
export default {
  created() {
    this.setBlur(true);
  },
  beforeDestroy() {
    this.setBlur(false);
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      const name = e.target.name.value;
      const password = e.target.password.value;
      this.login({ name, password }).then(() => {
        this.$router.push({ path: '/' })
      });
    },
    ...mapMutations(['setBlur']),
    ...mapActions(['login'])
  }
}
</script>
