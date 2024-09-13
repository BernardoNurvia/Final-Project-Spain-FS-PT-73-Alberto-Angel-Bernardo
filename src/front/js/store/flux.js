const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			selectedSalon: null,
			selectedProfessional: null,
			selectedService: null, // Añadir el servicio seleccionado
			professional: []
		},
		actions: {
			selectSalon: (salon) => {
				setStore({ selectedSalon: salon });
			},
			selectProfessional: (professional) => {
				setStore({ selectedProfessional: professional });
			},
			selectService: (service) => { // Acción para seleccionar el servicio
				setStore({ selectedService: service });
			},
			getProfessional: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/employees")
					const data = await resp.json()
					setStore({ professional: data.professional })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
		}
	};
};

export default getState;
