import base64
import streamlit as st
import pandas as pd
import yfinance as yf
from streamlit_option_menu import option_menu
import time
import plotly.graph_objects as go
import calendar
from datetime import datetime
import pyrebase
import urllib3
from PIL import Image

st.set_page_config(
    page_title="Stock Market Assistant",
    page_icon="📈",
    layout="wide",
)


firebaseConfig = {
    'apiKey': "AIzaSyAA5-RemYvIDEMSP1Th9QD0UN6SjJr_RpA",
    'authDomain': "stockmarketvisualiser.firebaseapp.com",
    'projectId': "stockmarketvisualiser",
    'databaseURL':"https://stockmarketvisualiser-default-rtdb.europe-west1.firebasedatabase.app/",
    'storageBucket': "stockmarketvisualiser.appspot.com",
    'messagingSenderId': "629269105152",
    'appId': "1:629269105152:web:9a088e777728bcd46be6e5",
    'measurementId': "G-KEB53T1EJR"
  }

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()


st.sidebar.title("Fincentive")
choice = st.sidebar.selectbox("login/Signup", ['Login', 'Sign up'])

email = st.sidebar.text_input('Please enter your email')
password = st.sidebar.text_input("Please enter an 8 character password")

if choice == 'Sign up':
    handle = st.sidebar.text_input("Please enter your username", value = 'Default')
    submit = st.sidebar.button('Create my account')

    if submit:
        user = auth.create_user_with_email_and_password(email,password)
        st.success('Your account is active')
        st.balloons()
        #Sign in
        user = auth.sign_in_with_email_and_password(email, password)
        db.child(user['localId']).child("Handle").set(handle)
        db.child(user['localId']).child("ID").set(user['localId'])
        st.title('Welcome ' + handle)
        st.info('Login via login drop down selection')

if choice == 'Login':
    login = st.sidebar.checkbox('Login')
    if login:
        user = auth.sign_in_with_email_and_password(email, password)
        if not db.child(user['localId']).child("Money").shallow().get().val():
            data = {"Money": 1000000}
        else:
            fetcheddata = db.child(user['localId']).child("Money").get().val()
            data = {"Money": fetcheddata["Money"]}

        db.child(user['localId']).child("Money").set(data)
        if 'money_end' not in st.session_state:
            moneydb = (db.child(user['localId']).child("Money").get()).val()
            st.session_state.money_end = moneydb["Money"]


hide_st_style = """
            <style>
            #MainMenu {visibility: hidden;}
            footer {visibility: hidden;}
            header {visibility: hidden;}
            </style>
            """
st.markdown(hide_st_style, unsafe_allow_html=True)

col3, col4, col5 = st.columns(3)

with col3:
    st.write('')

with col4:
    st.image("image3.png")

with col5:
    st.write(' ')



selected = option_menu(
    menu_title=None,
    options=["About", "Stocks"],
    icons = ["book", "graph-up"],
    default_index=0,
    orientation="horizontal",
    styles={
        "container": {"border-radius": "5px", "margin-right": "auto", "margin-left": "auto", 
                      "padding": "5px",  "width": "100%", "justify-content": "space-around",}
    }
)

today = pd.to_datetime("today")
tickers = []
transactionid = 0


investment = []
portfolio = 0
activelog = []
transactionlog = []

def getprice(ticker):
    ticker = yf.Ticker(ticker)
    todays_data = ticker.history(period='1d')
    return todays_data['Close'][0]

def buy(quantity, ticker):
    global portfolio, allocated_money, data
    price = getprice(ticker)
    allocated_money = quantity*price
    st.session_state.money_end -= allocated_money
    db.child(user['localId']).child("Money").update({"Money": st.session_state.money_end})
    portfolio += quantity
    investment.append(allocated_money)

def sell(quantity, ticker):
    global portfolio, allocated_money
    price = getprice(ticker)
    allocated_money = quantity*price
    st.session_state.money_end += allocated_money
    db.child(user['localId']).child("Money").update({"Money": st.session_state.money_end})
    portfolio -= quantity
    investment.append(-allocated_money)


if selected == "Stocks":
    st.title("Current Balance:")
    current_balance = f"{round(st.session_state.money_end)} $"
    st.subheader(current_balance)
    col1, col2 = st.columns([4,4], gap = "medium")
    tickers = ("A", "AAL", "AAPL", "ABB", "ABBV", "ABC", "ABEV", "ABNB", "ABT", "ACGL", "ACI", 
               "ACM", "ACN", "ADBE", "ADI", "ADM", "ADP", "ADSK", "AEE", "AEG", "AEM", "AEP", 
               "AER", "AES", "AFG", "AFL", "AGCO", "AGR", "AIG", "AJG", "AKAM", "ALB", "ALC", 
               "ALGN", "ALL", "ALNY", "AMAT", "AMCR", "AMD", "AME", "AMGN", "AMH", "AMOV", "AMP", 
               "AMT", "AMX", "AMZN", "ANET", "ANSS", "AON", "APA", "APD", "APH", "APO", "APTV", 
               "ARCC", "ARE", "ARES", "ARGX", "ASML", "ASX", "ATO", "ATVI", "AVB", "AVGO", "AVTR", 
               "AVY", "AWK", "AXON", "AXP", "AZN", "AZO", "AZPN", "BA", "BABA", "BAC", "BAH", "BALL", 
               "BAM", "BAP", "BAX", "BBD", "BBDO", "BBVA", "BBY", "BCE", "BCH", "BCS", "BDX", "BEKE", 
               "BEN", "BG", "BGNE", "BHP", "BIDU", "BIIB", "BIO", "BIP", "BK", "BKNG", "BKR", "BLDR", 
               "BLK", "BMO", "BMRN", "BMY", "BN", "BNS", "BNTX", "BP", "BR", "BRK/A", "BRK/B", "BRKR", 
               "BRO", "BSBR", "BSX", "BSY", "BTI", "BUD", "BURL", "BWA", "BX", "BXP", "C", "CAG", "CAH", 
               "CAJ", "CARR", "CAT", "CB", "CBOE", "CBRE", "CCEP", "CCI", "CCJ", "CCK", "CCL", "CDAY", 
               "CDNS", "CDW", "CE", "CEG", "CF", "CFG", "CG", "CHD", "CHK", "CHKP", "CHRW", "CHT", "CHTR", 
               "CHWY", "CI", "CINF", "CL", "CLF", "CLX", "CM", "CMCSA", "CME", "CMG", "CMI", "CMS", "CNA", 
               "CNC", "CNHI", "CNI", "CNP", "CNQ", "COF", "COIN", "COO", "COP", "COST", "CP", "CPB", "CPNG", 
               "CPRT", "CPT", "CQP", "CRBG", "CRH", "CRL", "CRM", "CRWD", "CS", "CSCO", "CSGP", "CSL", "CSX", 
               "CTAS", "CTLT", "CTRA", "CTSH", "CTVA", "CUK", "CVE", "CVS", "CVX", "CZR", "D", "DAL", "DAR", "DASH", 
               "DB", "DD", "DDOG", "DE", "DECK", "DELL", "DEO", "DFS", "DG", "DGX", "DHI", "DHR", "DINO", "DIS", "DKS", 
               "DLR", "DLTR", "DOCU", "DOV", "DOW", "DOX", "DPZ", "DRI", "DT", "DTE", "DUK", "DVN", "DXCM", "E", 
               "EA", "EBAY", "EBR", "EC", "ECL", "ED", "EFX", "EIX", "EL", "ELP", "ELS", "ELV", "EMR", "ENB", "ENPH", 
               "ENTG", "EOG", "EPAM", "EPD", "EQH", "EQIX", "EQNR", "EQR", "EQT", "ERIC", "ERIE", "ES", "ESS", "ET", 
               "ETN", "ETR", "ETSY", "EVRG", "EW", "EWBC", "EXAS", "EXC", "EXPD", "EXPE", "EXR", "F", "FANG", "FAST", 
               "FCNCA", "FCX", "FDS", "FDX", "FE", "FERG", "FHN", "FICO", "FIS", "FISV", "FITB", "FIVE", "FLEX", "FLT", 
               "FMC", "FMS", "FMX", "FNF", "FNV", "FOX", "FOXA", "FRC", "FSLR", "FTNT", "FTS", "FTV", "FWONA", "FWONK", "GD", 
               "GDDY", "GE", "GEHC", "GEN", "GFL", "GFS", "GGG", "GIB", "GILD", "GIS", "GL", "GLPI", "GLW", "GM", "GMAB", "GOLD", 
               "GOOG", "GOOGL", "GPC", "GPN", "GRAB", "GRMN", "GS", "GSK", "GWW", "H", "HAL", "HBAN", "HCA", "HD", "HDB", "HEI", "HES", "HIG", "HLN", "HLT", "HMC", "HOLX", "HON", "HPE", "HPQ", "HRL", "HSBC", "HSIC", "HST", "HSY", "HTHT", "HUBB", "HUBS", "HUM", "HWM", "HZNP", "IBM", "IBN", "ICE", "ICLR", "IDXX", "IEP", "IEX", "IFF", "IHG", "ILMN", "IMO", "INCY", "INFY", "ING", "INTC", "INTU", "INVH", "IP", "IPG", "IQV", "IR", "IRM", "ISRG", "IT", "ITUB", "ITW", "IX", "J", "JBHT", "JBL", "JCI", "JD", "JKHY", "JNJ", "JNPR", "JPM", "K", "KB", "KDP", "KEY", "KEYS", "KHC", "KIM", "KKR", "KLAC", "KMB", "KMI", "KMX", "KO", "KOF", "KR", "L", "LAMR", "LBRDA", "LBRDK", "LBTYB", "LBTYK", "LCID", "LDOS", "LEN", "LH", "LHX", "LI", "LIN", "LKQ", "LLY", "LMT", "LNG", "LNT", "LOW", "LPLA", "LRCX", "LSCC", "LSI", "LSXMA", "LSXMB", "LSXMK", "LULU", "LUV", "LVS", "LW", "LYB", "LYG", "LYV", "MA", "MAA", "MAR", "MAS", "MBLY", "MCD", "MCHP", "MCK", "MCO", "MDB", "MDLZ", "MDT", "MELI", "MET", "META", "MFC", "MFG", "MGA", "MGM", "MKC", "MKL", "MKTX", "MLM", "MMC", "MMM", "MMP", "MNST", "MO", "MOH", "MOS", "MPC", "MPLX", "MPWR", "MRK", "MRNA", "MRO", "MRVL", "MS", "MSCI", "MSFT", "MSI", "MT", "MTB", "MTCH", "MTD", "MU", "MUFG", "NDAQ", "NDSN", "NEE", "NEM", "NET", "NFLX", "NGG", "NI", "NICE", "NIO", "NKE", "NLY", "NMR", "NOC", "NOK", "NOW", "NSC", "NTAP", "NTES", "NTR", "NTRS", "NU", "NUE", "NVDA", "NVO", "NVR", "NVS", "NWG", "NWS", "NWSA", "NXPI", "O", "ODFL", "OKE", "OKTA", "OMC", "ON", "ORAN", "ORCL", "ORLY", "OTIS", "OVV", "OXY", "PAG", "PANW", "PARA", "PARAA", "PAYC", "PAYX", "PBA", "PBR", "PCAR", "PCG", "PCTY", "PDD", "PEAK", "PEG", "PEP", "PFE", "PFG", "PG", "PGR", "PH", "PHG", "PHM", "PINS", "PKG", "PKI", "PKX", "PLD", "PLTR", "PM", "PNC", "PODD", "POOL", "PPG", "PPL", "PRU", "PSA", "PSNY", "PSX", "PTC", "PUK", "PWR", "PXD", "PYPL", "QCOM", "QGEN", "QRVO", "QSR", "RACE", "RBLX", "RCI", "RCL", "RE", "REG", "REGN", "RELX", "REXR", "RF", "RIO", "RIVN", "RJF", "RMD", "ROK", "ROL", "ROP", "ROST", "RPM", "RPRX", "RRX", "RS", "RSG", "RTO", "RTX", "RY", "RYAAY", "SAN", "SAP", "SBAC", "SBUX", "SCCO", "SCHW", "SCI", "SE", "SEDG", "SGEN", "SHEL", "SHG", "SHOP", "SHW", "SIRI", "SIVB", "SJM", "SJR", "SLB", "SLF", "SMFG", "SNA", "SNAP", "SNN", "SNOW", "SNPS", "SNY", "SO", "SONY", "SPG", "SPGI", "SPLK", "SPOT", "SQ", "SQM", "SRE", "SRPT", "SSNC", "STE", "STLA", "STLD", "STM", "STT", "STX", "STZ", "SU", "SUI", "SUZ", "SWK", "SWKS", "SYF", "SYK", "SYY", "T", "TAK", "TAP", "TCOM", "TD", "TDG", "TDY", "TEAM", "TECH", "TECK", "TEF", "TEL", "TER", "TEVA", "TFC", "TFII", "TFX", "TGT", "TJX", "TLK", "TM", "TME", "TMO", "TMUS", "TOST", "TPL", "TPR", "TRGP", "TRI", "TRMB", "TROW", "TRP", "TRU", "TRV", "TS", "TSCO", "TSLA", "TSM", "TSN", "TT", "TTC", "TTD", "TTE", "TTWO", "TU", "TW", "TWLO", "TXN", "TXT", "TYL", "U", "UAL", "UBER", "UBS", "UDR", "UHAL", "UHS", "UI", "UL", "ULTA", "UMC", "UNH", "UNP", "UPS", "URI", "USB", "UTHR", "V", "VALE", "VEEV", "VICI", "VIV", "VLO", "VMC", "VMW", "VOD", "VRSK", "VRSN", "VRTX", "VTR", "VTRS", "VZ", "WAB", "WAT", "WBA", "WBD", "WCN", "WDAY", "WDC", "WDS", "WEC", "WELL", "WES", "WFC", "WIT", "WLK", "WM", "WMB", "WMG", "WMT", "WPC", "WPM", "WPP", "WRB", "WSC", "WSO", "WST", "WTRG", "WTW", "WY", "WYNN", "XEL", "XOM", "XYL", "YUM", "YUMC", "ZBH", "ZBRA", "ZI", "ZM", "ZS", "ZTO", "ZTS")
    with col1:
        dropdown = st.multiselect("Pick your assets", tickers)

        start = st.date_input("Start", value = pd.to_datetime('2021-01-01'))
        end = st.date_input("End", value = pd.to_datetime("today"))

    if len(dropdown) > 0:
        df = yf.download(dropdown, start, end)["Adj Close"]
        with col2:
            st.line_chart(df)
        st.write(dropdown[0])
        asset = dropdown[0].upper()
        quantity = st.slider("Number of shares")
        st.write("Quantity: ", quantity)
        buyresult = st.button("Buy")
        if buyresult:
            buy(quantity, asset)
            
            
        sellresult = st.button("Sell")
        if sellresult:
            sell(quantity, asset)

    
   

if selected == "About":
    st.header("HOW IT WORKS")
    st.divider()
    st.header("*Logging in*")
    st.subheader("First signup using the sidebar, then login using the same email and password you just entered.")
    image = Image.open('image1.png')
    st.image(image)
    st.divider()
    st.header("*The Virtual Stock Market*")
    st.subheader("The goal is to allow users to invest in the stockmarket risk free. This website allows them to get a better understanding of the stock market through practice.")
    image2 = Image.open('image2.png')
    st.image(image2)
