#!/bin/bash
clear
#--------------------------
# SCRIPT SSH-PLUS
# FEITO POR: @Brunex
#--------------------------

# - Cores
RED='\033[1;31m'
YELLOW='\033[1;33m'
SCOLOR='\033[0m'

# - Verifica Execucao Como Root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[x] VOCÊ PRECISA EXECUTAR COMO USUÁRIO ROOT!${SCOLOR}"
    exit 1
fi

# - Verifica Arquitetura Compativel
case "$(uname -m)" in
    'amd64' | 'x86_64')
        arch='64'
        ;;
    'aarch64' | 'armv8')
        arch='arm64'
        ;;
    *)
        echo -e "${RED}[x] ARQUITETURA INCOMPATÍVEL!${SCOLOR}"
        exit 1
        ;;
esac

# - Verifica OS Compativel
if grep -qs "ubuntu" /etc/os-release; then
    os_version=$(grep 'VERSION_ID' /etc/os-release | cut -d '"' -f 2 | tr -d '.')
    [[ "$os_version" -lt 1804 ]] && {
        echo -e "${RED}[x] VERSÃO DO UBUNTU INCOMPATÍVEL!\n${YELLOW}[!] REQUER UBUNTU 18.04 OU SUPERIOR!${SCOLOR}"
        exit 1
    }
elif [[ -e /etc/debian_version ]]; then
    os_version=$(grep -oE '[0-9]+' /etc/debian_version | head -1)
    [[ "$os_version" -lt 9 ]] && {
        echo -e "${RED}[x] VERSÃO DO DEBIAN INCOMPATÍVEL!\n${YELLOW}[!] REQUER DEBIAN 9 OU SUPERIOR!${SCOLOR}"
        exit 1
    }
else
    echo -e "${RED}[x] OS INCOMPATÍVEL!\n${YELLOW}[!] REQUER DISTROS BASE DEBIAN/UBUNTU!${SCOLOR}"
    exit 1
fi

# - Atualiza Lista/Pacotes/Sistema
apt update -y && apt upgrade -y
apt install unzip python3 -y

# - Desabilita ipv6
if [ -f "/etc/sysctl.d/70-disable-ipv6.conf" ]; then
    echo -e "${YELLOW}[!] O arquivo '/etc/sysctl.d/70-disable-ipv6.conf' já existe! Removendo...${SCOLOR}"
    rm "/etc/sysctl.d/70-disable-ipv6.conf"
fi
echo 'net.ipv6.conf.all.disable_ipv6 = 1' > /etc/sysctl.d/70-disable-ipv6.conf
sysctl -p -f /etc/sysctl.d/70-disable-ipv6.conf

# - Execulta instalador
cd /tmp || exit
if [ -f "Plus" ]; then
    echo -e "${YELLOW}[!] O arquivo 'Plus' já existe! Removendo...${SCOLOR}"
    rm "Plus"
fi
wget -q "https://raw.githubusercontent.com/BGXSJYRABJE/hdisbsi/main/script/${arch}/Plus" && chmod +x Plus && ./Plus

