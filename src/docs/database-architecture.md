
# EcoTrajet Database Architecture

This document outlines the database schema for the EcoTrajet platform, a comprehensive eco-mobility application for tracking, encouraging, and rewarding sustainable transportation choices.

## Overview

The database architecture is designed to support the following core functionalities:
- User management and authentication
- Eco-friendly trip tracking and carbon savings calculation
- Challenge and badge gamification systems
- Community engagement and social features
- Content management (articles, tutorials, notifications)
- User customization (themes, avatars, titles)

## Database Tables

### 1. users

**Purpose**: Central table storing core user information and authentication details.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique identifier for each user
- `email`: text NOT NULL UNIQUE - User's email address for authentication and communication
- `password_hash`: text NOT NULL - Securely stored password (never stored in plain text)
- `first_name`: text - User's first name
- `last_name`: text - User's last name
- `avatar_url`: text - URL to user's profile picture
- `bio`: text - User's self-description
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Account creation timestamp
- `updated_at`: timestamp with time zone DEFAULT now() NOT NULL - Last update timestamp
- `last_login`: timestamp with time zone - Most recent login time
- `selected_title`: text - Currently displayed user title
- `selected_theme`: text - User's preferred UI theme
- `eco_points`: integer DEFAULT 0 - Accumulated gamification points
- `level`: integer DEFAULT 1 - User's current level in the platform
- `is_admin`: boolean DEFAULT false - Administrator access flag

**Role**: This table serves as the foundation for user identity within the system and connects to nearly all other user-specific data through relationships.

### 2. user_profiles

**Purpose**: Extended user information for profile completeness and personalization.

**Fields**:
- `user_id`: uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE - Links to main user record
- `address`: text - User's street address
- `city`: text - User's city
- `zip_code`: text - User's postal code
- `phone`: text - User's contact number
- `date_of_birth`: date - User's birth date
- `preferences`: jsonb - Flexible storage for user preferences

**Role**: Stores supplementary user information that isn't required for core functionality but enhances the user experience and enables personalization.

### 3. challenges

**Purpose**: Defines eco-challenges that motivate users to adopt sustainable behaviors.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique challenge identifier
- `title`: text NOT NULL - Challenge name
- `description`: text NOT NULL - Detailed explanation of the challenge
- `type`: text CHECK (type IN ('personal', 'community')) - Challenge participation type
- `points`: integer NOT NULL - Points awarded upon completion
- `goal`: integer - Quantitative target (if applicable)
- `duration`: text NOT NULL - Time period for challenge completion
- `difficulty`: text CHECK (difficulty IN ('easy', 'medium', 'hard')) - Challenge difficulty rating
- `category`: text CHECK (category IN ('travel', 'lifestyle', 'energy', 'waste')) - Challenge category
- `icon`: text - Visual representation
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp
- `updated_at`: timestamp with time zone DEFAULT now() NOT NULL - Last update timestamp

**Role**: Forms the foundation of the gamification system by providing structured activities that encourage eco-friendly behaviors and foster community engagement.

### 4. user_challenges

**Purpose**: Junction table tracking user participation in challenges.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique record identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Participating user
- `challenge_id`: uuid REFERENCES challenges(id) ON DELETE CASCADE - Selected challenge
- `status`: text CHECK (status IN ('active', 'completed', 'recommended')) - Challenge status
- `progress`: integer DEFAULT 0 - Current progress toward goal
- `started_at`: timestamp with time zone DEFAULT now() NOT NULL - Start timestamp
- `completed_at`: timestamp with time zone - Completion timestamp
- `deadline`: timestamp with time zone - Challenge completion deadline
- UNIQUE(user_id, challenge_id) - Ensures a user can't accept the same challenge multiple times

**Role**: Creates the many-to-many relationship between users and challenges, tracking individual progress and participation.

### 5. badges

**Purpose**: Defines achievement badges that recognize user accomplishments.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique badge identifier
- `title`: text NOT NULL - Badge name
- `description`: text NOT NULL - Achievement description
- `icon`: text NOT NULL - Visual representation
- `category`: text CHECK (category IN ('debutant', 'intermediaire', 'expert', 'special')) - Badge category
- `condition`: text NOT NULL - Requirements for earning the badge
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp

**Role**: Provides recognition mechanisms for user achievements, encouraging continued engagement and highlighting expertise in specific areas.

### 6. user_badges

**Purpose**: Junction table tracking badges earned by users.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique record identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Badge earner
- `badge_id`: uuid REFERENCES badges(id) ON DELETE CASCADE - Earned badge
- `obtained`: boolean DEFAULT false - Whether badge is fully earned
- `progress`: integer DEFAULT 0 - Progress toward badge requirements
- `unlocked_at`: timestamp with time zone - When badge was earned
- UNIQUE(user_id, badge_id) - Ensures a user can't earn the same badge multiple times

**Role**: Tracks badge accomplishments for each user, supporting profile showcasing and gamification features.

### 7. trips

**Purpose**: Records eco-friendly journeys taken by users.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique trip identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Trip taker
- `start_location`: point NOT NULL - Trip origin coordinates
- `end_location`: point NOT NULL - Trip destination coordinates
- `distance`: numeric NOT NULL - Trip distance in kilometers
- `duration`: interval NOT NULL - Trip duration
- `co2_saved`: numeric - Estimated carbon emissions saved
- `transport_mode`: text CHECK (transport_mode IN ('bike', 'walk', 'public_transport', 'car', 'other')) - Method of transport
- `started_at`: timestamp with time zone NOT NULL - Trip start time
- `completed_at`: timestamp with time zone - Trip end time
- `route_data`: jsonb - Detailed route information

**Role**: Central to the platform's core functionality, this table records user transportation choices and calculates environmental impact, serving as the foundation for many gamification features.

### 8. user_levels

**Purpose**: Defines the leveling system for user progression.

**Fields**:
- `level`: integer PRIMARY KEY - Level number
- `title`: text NOT NULL - Level name
- `min_points`: integer NOT NULL - Minimum points required
- `max_points`: integer NOT NULL - Maximum points for this level
- `icon`: text NOT NULL - Visual representation

**Role**: Structures the user progression system, defining thresholds for advancement and rewards.

### 9. articles

**Purpose**: Stores educational and informational content.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique article identifier
- `title`: text NOT NULL - Article headline
- `content`: text NOT NULL - Full article body
- `summary`: text - Brief article overview
- `author_id`: uuid REFERENCES users(id) ON DELETE SET NULL - Content creator
- `published_at`: timestamp with time zone - Publication date
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp
- `updated_at`: timestamp with time zone DEFAULT now() NOT NULL - Last update timestamp
- `status`: text CHECK (status IN ('draft', 'published', 'archived')) - Publication status
- `image_url`: text - Featured image
- `category`: text - Content category

**Role**: Provides educational resources and platform news to users, enhancing user knowledge about eco-friendly practices.

### 10. tutorials

**Purpose**: Stores instructional content for using the platform and eco-friendly practices.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique tutorial identifier
- `title`: text NOT NULL - Tutorial title
- `description`: text NOT NULL - Brief overview
- `content`: text - Textual instructions
- `video_url`: text - Link to video content
- `thumbnail_url`: text - Preview image
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp
- `updated_at`: timestamp with time zone DEFAULT now() NOT NULL - Last update timestamp
- `difficulty_level`: text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) - Complexity rating
- `duration_minutes`: integer - Estimated completion time

**Role**: Provides structured learning resources to help users maximize platform benefits and adopt sustainable practices.

### 11. notifications

**Purpose**: Manages user alerts and system messages.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique notification identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Recipient
- `title`: text NOT NULL - Notification title
- `message`: text NOT NULL - Notification content
- `type`: text CHECK (type IN ('challenge', 'reward', 'system', 'trip')) - Notification category
- `is_read`: boolean DEFAULT false - Read status
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp
- `link`: text - Related page URL
- `related_id`: uuid - Associated record ID

**Role**: Facilitates user engagement through timely updates about achievements, system changes, and social interactions.

### 12. user_friends

**Purpose**: Manages social connections between users.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique relationship identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - User who initiated the connection
- `friend_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Connected user
- `status`: text CHECK (status IN ('pending', 'accepted', 'declined')) - Relationship status
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp
- `updated_at`: timestamp with time zone DEFAULT now() NOT NULL - Last update timestamp
- UNIQUE(user_id, friend_id) - Prevents duplicate relationships

**Role**: Enables the social networking aspect of the platform, allowing users to connect with friends and compete in eco-challenges.

### 13. community_impact

**Purpose**: Aggregates collective ecological achievements.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique record identifier
- `co2_saved`: numeric DEFAULT 0 - Total carbon emissions prevented
- `trees_equivalent`: numeric DEFAULT 0 - Equivalent number of trees planted
- `distance_covered`: numeric DEFAULT 0 - Total eco-friendly kilometers traveled
- `participating_users`: integer DEFAULT 0 - Active user count
- `trips_completed`: integer DEFAULT 0 - Total eco-trips recorded
- `recorded_at`: timestamp with time zone DEFAULT now() NOT NULL - Record timestamp

**Role**: Highlights the collective impact of the community, reinforcing the significance of individual choices when combined with others.

### 14. user_titles

**Purpose**: Defines special designations users can earn and display.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique title identifier
- `title`: text NOT NULL UNIQUE - Display text
- `description`: text - Explanation of how to earn
- `condition`: text - Requirements for unlocking
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp

**Role**: Enhances user customization and recognition within the platform, providing special designations based on achievements.

### 15. user_available_titles

**Purpose**: Junction table tracking titles unlocked by users.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique record identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Title holder
- `title_id`: uuid REFERENCES user_titles(id) ON DELETE CASCADE - Unlocked title
- `unlocked_at`: timestamp with time zone DEFAULT now() NOT NULL - When title was earned
- UNIQUE(user_id, title_id) - Ensures a title is only unlocked once per user

**Role**: Creates the many-to-many relationship between users and titles, tracking which users have unlocked which customization options.

### 16. user_avatars

**Purpose**: Defines available profile picture options.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique avatar identifier
- `url`: text NOT NULL - Image location
- `name`: text NOT NULL - Display name
- `condition`: text - Requirements for unlocking
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp

**Role**: Provides visual customization options for user profiles, with some exclusive avatars requiring achievements to unlock.

### 17. user_available_avatars

**Purpose**: Junction table tracking avatars unlocked by users.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique record identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Avatar owner
- `avatar_id`: uuid REFERENCES user_avatars(id) ON DELETE CASCADE - Unlocked avatar
- `unlocked_at`: timestamp with time zone DEFAULT now() NOT NULL - When avatar was earned
- UNIQUE(user_id, avatar_id) - Ensures an avatar is only unlocked once per user

**Role**: Records which users have access to which avatars, allowing for exclusive visual customization rewards.

### 18. themes

**Purpose**: Defines interface appearance options.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique theme identifier
- `name`: text NOT NULL UNIQUE - Theme name
- `description`: text - Theme explanation
- `colors`: jsonb - Color scheme definition
- `created_at`: timestamp with time zone DEFAULT now() NOT NULL - Creation timestamp

**Role**: Provides visual customization options for the platform interface, enhancing user experience through personalization.

### 19. user_available_themes

**Purpose**: Junction table tracking themes unlocked by users.

**Fields**:
- `id`: uuid PRIMARY KEY - Unique record identifier
- `user_id`: uuid REFERENCES users(id) ON DELETE CASCADE - Theme owner
- `theme_id`: uuid REFERENCES themes(id) ON DELETE CASCADE - Unlocked theme
- `unlocked_at`: timestamp with time zone DEFAULT now() NOT NULL - When theme was earned
- UNIQUE(user_id, theme_id) - Ensures a theme is only unlocked once per user

**Role**: Creates the many-to-many relationship between users and themes, tracking which users have access to which interface customization options.

## Key Relationships

1. **User-centric relationships**:
   - One user can have many trips (1:N)
   - One user can participate in many challenges (M:N through user_challenges)
   - One user can earn many badges (M:N through user_badges)
   - One user can have many notifications (1:N)
   - Users can be friends with many other users (M:N self-referential through user_friends)
   - One user can have many available titles, avatars, and themes (M:N through respective junction tables)

2. **Challenge relationships**:
   - Many users can participate in many challenges (M:N through user_challenges)

3. **Badge relationships**:
   - Many users can earn many badges (M:N through user_badges)

4. **Content relationships**:
   - Articles and tutorials are independent entities with potential user authorship

## Database Schema Diagram

```
users 1 -- * trips
users 1 -- * notifications
users * -- * challenges (via user_challenges)
users * -- * badges (via user_badges)
users * -- * users (via user_friends)
users * -- * user_titles (via user_available_titles)
users * -- * user_avatars (via user_available_avatars)
users * -- * themes (via user_available_themes)
users 1 -- 1 user_profiles
```

## Indexing Strategy

- Create indexes on all foreign keys
- Create indexes on frequently queried fields such as:
  - users: email
  - trips: user_id, transport_mode, started_at
  - user_challenges: user_id, status
  - notifications: user_id, is_read
  - articles: status, published_at, category
  - tutorials: difficulty_level

## Security Considerations

1. **Row Level Security (RLS)**: Implement RLS policies on sensitive tables to ensure users can only access their own data.
   
2. **Audit Logging**: Create a separate audit_logs table to track significant changes to critical data for security monitoring.

3. **Password Security**: Ensure password_hash is properly secured using strong hashing algorithms (e.g., bcrypt, Argon2).

4. **Data Encryption**: Consider encrypting sensitive personal information in the user_profiles table.

## Performance Optimization

1. **Use PostgreSQL's JSONB** for fields that might change structure over time (e.g., preferences, route_data).

2. **Implement strategic caching** for frequently accessed, relatively static data like challenge definitions.

3. **Create materialized views** for complex aggregations like leaderboards and community statistics.

4. **Use GIS extensions** (PostGIS) for optimized geographic data handling and calculations.

5. **Implement connection pooling** for efficient database connection management.

## Data Integrity

1. **Cascading deletes** are implemented to maintain referential integrity while preventing orphaned records.

2. **Constraints and checks** ensure data validity across the system.

3. **Triggers** for automatic updates of fields like updated_at maintain data consistency.

## Future Considerations

1. **Partitioning**: For tables expected to grow significantly (e.g., trips), consider implementing table partitioning for improved query performance.

2. **Archiving Strategy**: Develop a strategy for archiving old data to maintain optimal database performance.

3. **Analytics Support**: Consider creating dedicated analytics tables or views to support reporting without impacting application performance.
