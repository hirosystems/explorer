export const SEMANTIC_TOKENS = {
  colors: {
    brand: { value: '#FC6432' },
    borderPrimary: {
      value: { base: '{colors.slate.250}', _dark: '{colors.slate.850}' },
    },
    borderSecondary: {
      value: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
    },
    error: {
      value: { base: '{colors.red.600}', _dark: '{colors.red.500}' },
    },
    minorError: {
      value: { base: '{colors.orange.500}', _dark: '{colors.orange.600}' },
    },
    success: {
      value: { base: '{colors.green.600}', _dark: '{colors.green.500}' },
    },
    surface: {
      value: { base: '{colors.white}', _dark: '{colors.black}' },
    },
    surfaceOpposite: {
      value: { base: '{colors.black}', _dark: '{colors.white}' },
    },
    surfaceHighlight: {
      value: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
    },
    text: {
      value: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
    },
    textSubdued: {
      value: { base: '{colors.slate.700}', _dark: '{colors.slate.600}' },
    },
    buttonText: {
      value: { base: '{colors.brand}', _dark: '{colors.purple.400}' },
    },
    interactive: {
      value: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
    },
    hoverBackground: {
      value: { base: '{colors.slate.150}', _dark: '{colors.slate.850}' },
    },
    icon: {
      value: { base: '{colors.slate.900}', _dark: '{colors.slate.50}' },
    },
    iconSubdued: {
      value: { base: '{colors.slate.700}', _dark: '{colors.slate.600}' },
    },
    invert: {
      value: { base: '{colors.black}', _dark: '{colors.white}' },
    },
    table: {
      header: {
        background: {
          value: { base: '{colors.slate.150}', _dark: '{colors.slate.850}' },
        },
        text: {
          value: { base: '{colors.slate.700}', _dark: '{colors.slate.250}' },
        },
      },
    },
    blockList: {
      btcBlockRowText: {
        value: { base: '{colors.slate.700}', _dark: '{colors.slate.500}' },
      },
      btcBlockRowIcon: {
        value: { base: '{colors.slate.600}', _dark: '{colors.slate.800}' },
      },
      blockCount: {
        background: {
          value: { base: '{colors.purple.100}', _dark: '{colors.slate.900}' },
        },
        backgroundHover: {
          value: { base: '{colors.purple.200}', _dark: '{colors.purple.850}' },
        },
        text: {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
        },
        icon: {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.200}' },
        },
      },
      updateBar: {
        background: { value: { base: '{colors.purple.100}', _dark: '{colors.slate.900}' } },
        text: { value: { base: '{colors.slate.800}', _dark: '{colors.slate.400}' } },
      },
    },
    navbar: {
      // this is the same as the time filter
      networkLabelBadge: {
        value: { base: '{colors.purple.600}', _dark: '{colors.purple.300}' },
      },
      networkLabelBadgeBackground: {
        value: { base: '{colors.purple.100}', _dark: '{colors.purple.900}' },
      },
      networkLabelBadgeBorder: {
        value: { base: '{colors.purple.300}', _dark: '{colors.purple.700}' },
      },
    },
    timeFilter: {
      // this is the same as the navbar
      text: {
        value: { base: '{colors.purple.600}', _dark: '{colors.purple.300}' },
      },
      background: {
        value: { base: '{colors.purple.100}', _dark: '{colors.purple.900}' },
      },
      border: {
        value: { base: '{colors.purple.300}', _dark: '{colors.purple.700}' },
      },
    },
    statusPage: {
      incidentImpact: {
        value: { base: '{colors.purple.400}', _dark: '{colors.purple.600}' },
      },
      text: {
        value: { base: '{colors.slate.50}', _dark: '{colors.slate.900}' },
      },
      border: {
        value: { base: '{colors.slate.850}', _dark: '{colors.slate.250}' },
      },
    },
    stackingPercentageProgressColor: {
      value: { base: '{colors.brand}', _dark: '{colors.purple.400}' },
    },
    sandbox: {
      navItem: {
        selectedBackground: {
          value: { base: '{colors.slate.150}', _dark: '{colors.slate.800}' },
        },
        hoverBackground: {
          value: { base: '{colors.slate.100}', _dark: '{colors.slate.900}' },
        },
        border: {
          value: { base: '{colors.slate.150}', _dark: '{colors.slate.900}' },
        },
      },
    },
    signers: {
      currentCycle: {
        fill: {
          value: { base: '{colors.purple.200}', _dark: '{colors.purple.850}' },
        },
      },
      progressBar: {
        progressColor: {
          value: {
            base: `linear-gradient(to right, {colors.mode.600} 0%, {colors.mode.400} 100%)`,
            _dark: `linear-gradient(to right, {colors.mode.500}, {colors.mode.400})`,
          },
        },
        backgroundColor: {
          value: { base: '{colors.mode.200}', _dark: '{colors.mode.850}' }, // TODO: fix. There is no mode.200/850
        },
      },
      legendItem: {
        unknownSigner: {
          value: { base: '{colors.slate.250}', _dark: '{colors.slate.800}' },
        },
      },
      continentPill: {
        activeBackgroundColor: {
          value: { base: '{colors.purple.100}', _dark: '{colors.slate.850}' },
        },
        activeTextColor: {
          value: { base: '{colors.purple.600}', _dark: '{colors.purple.400}' },
        },
      },
    },
    transactions: {
      mempoolFeePieChart: {
        label: {
          value: { base: '{colors.slate.700}', _dark: '{colors.slate.500}' },
        },
      },
      mempoolFeePriorityCard: {
        borderColor: {
          value: { base: '{colors.slate.200}', _dark: '{colors.slate.800}' },
        },
        textColor: {
          value: { base: '{colors.slate.700}', _dark: '{colors.slate.500}' },
        },
      },
    },
    filterMenu: {
      borderColor: {
        value: { base: '{colors.slate.300}', _dark: '{colors.slate.900}' },
      },
    },
    stxPrice: {
      background: {
        value: { base: '{colors.purple.200}', _dark: '{colors.purple.400}' },
      },
      hoverBackground: {
        value: { base: '{colors.purple.300}', _dark: '{colors.purple.300}' },
      },
    },
    filterButton: {
      hoverBackground: {
        value: { base: '{colors.slate.100}', _dark: '{colors.slate.800}' },
      },
      borderColor: {
        value: { base: '{colors.slate.300}', _dark: '{colors.slate.900}' },
      },
    },
    cycleFilter: {
      iconButton: {
        backgroundColor: {
          value: { base: '{colors.gray.100}', _dark: '{colors.whiteAlpha.200}' },
        },
        hoverBackgroundColor: {
          value: { base: '{colors.gray.200}', _dark: '{colors.whiteAlpha.300}' },
        },
      },
    },
  },
};
