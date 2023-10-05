type Alert = {
    _id: string,
    userId: string,
    eventId: string,
    time: string,
    desiredPrice: number,
    desiredSections: number[],
    notified: boolean,
    priceHistory: string
}

function AlertCard(props : Alert) {
    return (
        <div>
            Alert set up {props.time}
            Desired Price {props.desiredPrice}
            Desired Sections {props.desiredSections},
            Notified yet? {props.notified}
        </div>
    )
}

export default AlertCard;