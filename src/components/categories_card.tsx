import { faChevronRight, faFileLines, faHeadset, faQuestionCircle, faStar, faTriangleExclamation, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ModerationCategory } from "../model/dashboard_model";
import { Avatar, Card, CardContent, Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CategoriesCardProps {
  data: ModerationCategory[];
}

const CategoriesCard: React.FC<CategoriesCardProps> = ({ data }) => {
  const iconMap: { [key: string]: IconDefinition } = {
    pending_jobs: faFileLines,
    reported_profiles: faTriangleExclamation,
    support_tickets: faHeadset,
    new_reviews: faStar,
    default: faQuestionCircle,
  };

  return (
    <Card component={Paper} elevation={3} sx={{ height: '100%' }}>
      <CardContent >
        <Typography sx={{textAlign: "center", fontWeight: "bold"}} variant="h6" gutterBottom>
          DUYỆT NỘI DUNG
        </Typography>
      </CardContent>
      <List sx={{ p: 0 }}>
        {data.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 && <Divider variant="middle" component="li" />}
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="details">
                  <FontAwesomeIcon icon={faChevronRight} size="xs" />
                </IconButton>
              }
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Avatar sx={{ width: 34, height: 34 }}>
                  <FontAwesomeIcon
                    icon={iconMap[item.type] || iconMap.default}
                    size="sm"
                  />
                </Avatar>
              </ListItemIcon>
              <ListItemText primary={item.primary} secondary={item.secondary} />
            </ListItem>
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default CategoriesCard