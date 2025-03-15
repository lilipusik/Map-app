export const getAddress = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ru`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          },
        }
      );
      const data = await response.json();
      const address = data.address;
  
      if (!address) {
        return 'Адрес не найден';
      }
  
      const city = address.city || address.town || address.village || '';
      const street = address.road || '';
      const house = address.house_number || '';
  
      let result = 'г. ' + city + ', ' + street + ', д. ' + house;
  
      return result.replace(/,\s*$/, '');
    } catch (error) {
      console.error('Ошибка при получении адреса:', error);
      throw error;
    }
  };