<template>
  <div class="text-center">
    <v-menu v-model="settingsMenu" :close-on-content-click="false" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon dark v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-card class="mx-auto" max-width="300" tile>
        <v-card-title>{{ selectedPortfolio.name }}</v-card-title>
        <v-list>
          <v-list-item-group>
          <v-list-item v-if="!selectedPortfolio.is_main">
            <v-list-item-icon class="mr-3">
              <v-icon> mdi-star </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Set this portfolio as main
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-dialog v-model="editDialog" max-width="500px">
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon class="mr-3">
                  <v-icon> mdi-pencil </v-icon>
                </v-list-item-icon>
                <v-list-item-content>Edit portfolio</v-list-item-content>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit portfolio's name</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editName"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeEdit">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveEdit">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog
            v-model="deleteDialog"
            max-width="500px"
            v-if="!selectedPortfolio.is_main"
          >
            <template #activator="{ on, attrs }">
              <v-list-item v-bind="attrs" v-on="on">
                <v-list-item-icon class="mr-3">
                  <v-icon> mdi-delete </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title> Delete this portfolio </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Delete this portfolio</span>
              </v-card-title>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="saveDelete">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-menu>
    <v-menu v-model="listMenu" :close-on-content-click="false" offset-x>
      <template v-slot:activator="{ on, attrs }">
        <v-btn outlined dark v-bind="attrs" v-on="on">
          {{ selectedPortfolio.name }}
          <v-icon right dark> mdi-chevron-down </v-icon>
        </v-btn>
      </template>

      <v-card class="mx-auto" max-width="300" tile>
        <v-card-title>Portfolios</v-card-title>
        <v-list>
          <!-- <v-list-item-group v-model="selectedItem" color="primary"> -->
            <v-list-item
              v-for="(item, i) in portfolios"
              :key="i"
              :value="item.name"
            >
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.name"
                  @click="selectPortfolio(item)"
                ></v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon v-if="item.is_main">
                <v-icon>mdi-star</v-icon>
              </v-list-item-icon>
            </v-list-item>
          <!-- </v-list-item-group> -->
        </v-list>
        <v-card-actions>
          <v-dialog v-model="createDialog" max-width="500px">
            <template #activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">
                <v-icon class="mr-2"> mdi-plus-box</v-icon>
                Add portfolio
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Create portfolio</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="createName"
                        label="Name"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="createClose">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="createSave">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data: () => ({
    settingsMenu: false,
    selectedSetting: 0,
    editDialog: false,
    editName: '',
    deleteDialog: false,
    listMenu: false,
    selectedItem: 0,
    createDialog: false,
    createName: '',
  }),
  methods: {
    closeDelete() {
      this.deleteDialog = false
    },

    saveDelete() {
      // save
      this.deletePortfolio(this.selectedPortfolio.name)
      this.closeDelete()
      this.settingsMenu = false
    },

    closeEdit() {
      this.editDialog = false
      this.editName = ''
    },

    saveEdit() {
      const req = {"currentName": this.selectedPortfolio.name, "name": this.editName}
      this.editPortfolio(req)
      this.closeEdit()
    },

    createClose() {
      this.createDialog = false
      this.$nextTick(() => {
        this.createName = ''
      })
    },

    createSave() {
      this.createPortfolio(this.createName)
      this.createClose()
      this.listMenu = false
      this.createName = ''
    },

    selectPortfolio(item) {
      this.listMenu = false
      this.setPortfolio(item)
    },
    ...mapActions('dashboard', ['setPortfolio', 'createPortfolio', 'deletePortfolio', 'editPortfolio']),
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters('dashboard', ['portfolios', 'selectedPortfolio']),
  },
}
</script>
