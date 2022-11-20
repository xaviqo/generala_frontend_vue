<template>
    <v-footer dark width="100%" padless absolute>
        <v-card class="flex" flat tile>
            <v-card-title>
                <v-spacer></v-spacer>
                <v-card-text class="py-2 white--text text-center">
                    {{ new Date().getFullYear() }} — <strong>Generala.net</strong>
                </v-card-text>
            </v-card-title>
        </v-card>
    </v-footer>
</template>
<script>
export default {
    data: () => ({
    }),
}
</script>
<style>
#app > div > footer {
    padding: 0 !important;
}
</style>