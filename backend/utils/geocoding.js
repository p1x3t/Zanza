import axios from 'axios';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

export async function geocodeAddress({ cep, street, number, neighborhood, city, state }) {
  try {
    // Prioriza busca por CEP quando disponível
    if (cep) {
      const cepClean = cep.replace(/\D/g, '');
      const viaCep = await axios.get(`https://viacep.com.br/ws/${cepClean}/json/`);
      
      if (!viaCep.data.erro) {
        const address = `${viaCep.data.logradouro}, ${viaCep.data.bairro}, ${viaCep.data.localidade}, ${viaCep.data.uf}`;
        const geo = await axios.get(`${NOMINATIM_URL}/search`, {
          params: {
            q: address,
            format: 'json',
            limit: 1,
            'accept-language': 'pt-BR'
          },
          headers: { 'User-Agent': 'ZanzaApp/1.0' }
        });

        if (geo.data[0]) {
          return {
            latitude: parseFloat(geo.data[0].lat),
            longitude: parseFloat(geo.data[0].lon),
            formatted: geo.data[0].display_name,
            source: 'nominatim'
          };
        }
      }
    }

    // Fallback: busca por endereço completo
    const parts = [street, number, neighborhood, city, state, 'Brasil'].filter(Boolean);
    const query = parts.join(', ');

    const geo = await axios.get(`${NOMINATIM_URL}/search`, {
      params: {
        q: query,
        format: 'json',
        limit: 1,
        'accept-language': 'pt-BR'
      },
      headers: { 'User-Agent': 'ZanzaApp/1.0' }
    });

    if (geo.data[0]) {
      return {
        latitude: parseFloat(geo.data[0].lat),
        longitude: parseFloat(geo.data[0].lon),
        formatted: geo.data[0].display_name,
        source: 'nominatim'
      };
    }

    throw new Error('Endereço não encontrado');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    return null;
  }
}