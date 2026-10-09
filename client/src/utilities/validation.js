/**
 * Validates selected options against impossible feature combination rules.
 * Returns { isValid: boolean, error: string | null, incompatibleOptionIds: Set<string> }
 */

export const checkIncompatibility = (selectedOptions) => {
  const disabledOptionIds = new Set()
  let activeError = null

  // Rule 1: Convertible Soft Top + Roof Cargo Rack
  if (selectedOptions.roof === 'convertible') {
    disabledOptionIds.add('roof_rack')
    if (selectedOptions.accessories === 'roof_rack') {
      activeError = 'Convertible Soft Top cannot be combined with Roof Cargo Rack.'
    }
  }

  if (selectedOptions.accessories === 'roof_rack') {
    disabledOptionIds.add('convertible')
    if (selectedOptions.roof === 'convertible' && !activeError) {
      activeError = 'Roof Cargo Rack cannot be installed on a Convertible Soft Top.'
    }
  }

  // Rule 2: Electric Powertrain + Exhaust Pipes
  if (selectedOptions.powertrain === 'electric') {
    disabledOptionIds.add('exhaust')
    if (selectedOptions.accessories === 'exhaust' && !activeError) {
      activeError = 'Eco Dual-Electric Motor cannot be combined with Dual Chrome Exhaust Pipes.'
    }
  }

  if (selectedOptions.accessories === 'exhaust') {
    disabledOptionIds.add('electric')
    if (selectedOptions.powertrain === 'electric' && !activeError) {
      activeError = 'Dual Chrome Exhaust Pipes cannot be installed on an Electric Powertrain.'
    }
  }

  return {
    isValid: activeError === null,
    error: activeError,
    disabledOptionIds
  }
}
