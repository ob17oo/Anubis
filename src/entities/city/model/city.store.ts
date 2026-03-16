import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
interface CityState {
    selectedCityId: string,
    selectedCityName: string,

    setSelectedCity: (cityId: string, cityName: string) => void
    resetToDefaultCity: () => void
}

const DEFAULT_CITY_ID = 'cmmjcycy600013b6svl5n4s62'
const DEFAULT_CITY_NAME = 'Москва'

export const useCityStore = create<CityState>() (
    devtools(
        persist(
            (set) => ({
                selectedCityId: DEFAULT_CITY_ID,
                selectedCityName: DEFAULT_CITY_NAME,

                setSelectedCity: (cityId: string, cityName: string) => 
                    set(
                        { 
                            selectedCityId: cityId, 
                            selectedCityName: cityName 
                        },
                        false,
                        {
                            type: 'CITY_CHANGED',
                            cityId,
                            cityName
                        }
                    ),
                resetToDefaultCity: () => 
                    set(
                        {
                            selectedCityId: DEFAULT_CITY_ID,
                            selectedCityName: DEFAULT_CITY_NAME
                        },
                        false,
                        { type: 'CITY_RESET' }
                    )
            }),
            {
                name: 'city-storage',
                version: 1,
                partialize: (state) => ({
                    selectedCityId: state.selectedCityId,
                    selectedCityName: state.selectedCityName
                })
            }
        )
    )
)


export const selectedCityId = (state: CityState) => state.selectedCityId
export const selectedCityName = (state: CityState) => state.selectedCityName
