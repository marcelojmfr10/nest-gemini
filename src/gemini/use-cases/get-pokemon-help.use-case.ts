import { GoogleGenAI } from '@google/genai';
import { PokemonHelperDto } from '../dtos/pokemon-helper.dto';

export interface PokemonResponse {
  [pokemonId: string]: string;
}

export const getPokemonHelpUseCase = async (
  ai: GoogleGenAI,
  pokemonHelperDto: PokemonHelperDto,
) => {
  const { name } = pokemonHelperDto;

  const interaction = await ai.interactions.create({
    model: 'gemini-3.6-flash',
    input: `El pokemon a vencer es ${name}`,
    response_format: ['application/json'],
    system_instruction: `Eres un Pokedex, que da recomendaciones de Pokémon para combatir contra otros Pokémon.
        Responde en un JSON, con el ID del pokemon y un ataque súper efectivo contra el Pokémon que se te da.
        Siempre responde 4 pokemons
        Este es el formato de respuesta:
        {
          1: 'tackle',
          20: 'quick-attack',
          23: 'thunderbolt',
          25: 'thunder'
        }
        
        Sólo retorna el objeto JSON, no des explicaciones ni nada más.`,
  });

  const jsonResponse = JSON.parse(interaction.output_text ?? '{}');
  return jsonResponse as PokemonResponse;
};
